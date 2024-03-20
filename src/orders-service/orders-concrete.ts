import axios, { AxiosError } from "axios";
import OrderType, { IOrder, orderStatus, paymentDetails } from "../models/orders.js";
import orders from "../models/orders.js";
import events from "../models/event.js";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";

import { HttpError } from "./order-error.js";
import { PAYMENT_URL } from "../const.js";
import {orederExpiredDate} from "../const.js";
import { stat } from "fs";
dotenv.config();

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;


export async function addNewOrder(req) : Promise<IOrder> {
        const order = validateAndGetOrder(req);
        const db = await mongoose.createConnection(dbURI).asPromise();
        const session = await db.startSession();
        session.startTransaction();
        const tickets_amout =  - order.ticket.quantity;

        try{
            const result = await events.findOneAndUpdate(
                { _id: order.event_id },
                { $inc: { "tickets.$[elem].quantity": tickets_amout } },
                { arrayFilters:[{$and:[ {"elem.name": order.ticket.name}, {"elem.quantity":{$gte: -tickets_amout}} ]}]}).exec();
            // await tryGetTicketsFromEvent(order);
            if (result.tickets.some((t) => {return t.name === order.ticket.name && t.quantity < -tickets_amout})){
                throw new HttpError(400, "not enough tickets");
            }
            if (result === null){
                throw new HttpError(404, "Event not found");
            }
            if (result.tickets.filter((t)=> t.name === order.ticket.name).length === 0){
                throw new HttpError(404, "Ticket not found");
            }
            await order.save();
            await session.commitTransaction()
        }catch(error ){
            await session.abortTransaction();
            throw error;
            return;
        } finally{
            session.endSession();
        }
        //TODO: send message to delete order when expired.
        return order;
    }


export async function deleteExpiredOrder(orderId: string) : Promise<IOrder | null> {
    const db = await mongoose.createConnection(dbURI).asPromise();
    const session = await db.startSession();
    session.startTransaction();
    let deleted_oreder = null;
    try{
        const result_order = await orders.findOneAndDelete(
            { _id: orderId },
            { arrayFilters:[{$and:[ {"elem.status": orderStatus.pending}, {"elem.expires_at":{$lte: new Date()}} ]}]}).exec();
        if (!result_order){
            throw new HttpError(404, "oredr not found");;
        }    
        const result_event = await events.findOneAndUpdate(
            { _id: result_order.event_id },
            { $inc: { "tickets.$[elem].quantity": result_order.ticket.quantity } },
            { arrayFilters:[{$and:[ {"elem.name": result_order.ticket.name}, {"elem.quantity":{$gte: -result_order.ticket.quantity}} ]}]}).exec();

        if (result_event.tickets.some((t) => {return t.name === result_order.ticket.name && t.quantity < -result_order.ticket.quantity})){
            throw new HttpError(400, "invalid tickets amount");;
        }
        await session.commitTransaction()
    }catch(error ){
        await session.abortTransaction();
        throw error;
        return;
    } finally{
        session.endSession();
    }
    //TODO: send message to delete order when expired.
    return deleted_oreder;
}

export async function handlePaymentRequest(req) {
        //lock order tickets
        req.body.order.status = orderStatus.inPayment;
        let order = await orders.findOneAndUpdate({_id: req.body.order._id}, {status: "inPayment"}).exec()??
        await addNewOrder(req.body.order);

        //try pay
        const paymentDetails : paymentDetails = {charge: order.ticket.price * order.ticket.quantity, ...req.body.payment_details};
        let paymentId;
        try {
            paymentId = (await axios.post(PAYMENT_URL, paymentDetails)).data;
            //TODO: check if card validation needed
        } catch (error) {
            //when payment fails, update back to pending and update expire if first try
            //TODO: add update expire if first try
            await orders.updateOne({_id: order._id}, {status: "pending"}).exec(); 
            if (error instanceof AxiosError) {
                throw new HttpError(error.response.status, error.response.data);
            } 
            console.log(error);
            throw new HttpError(500, "payment failed");  

        }

        await orders.updateOne({_id: order._id}, {status: "completed"}).exec();//TODO: maybe sould be async

        return paymentId;
    
}

function validateAndGetOrder(req){
    try{
        const order = new OrderType(req);
        order.validateSync();
        return order;
    }
    catch (error){
        if (error.name === "ValidationError"){
            throw new HttpError(400, error.message);
          }
        throw new HttpError(500,"failed to validate order");
    }};

async function tryGetTicketsFromEvent(order){
    try{
        
        await axios.patch(`${process.env.GATEWAY_URL}/tickets/${order.event_id}`, {name: order.ticket.name, quantity: -order.ticket.quantity});
    } catch (error: AxiosError | any){
        if (error instanceof AxiosError) {
            throw new HttpError(error.response.status, error.response.data);
        } 
        console.log(error);
        throw new HttpError(500, "failed to get tickets from event");       
    }
}
async function trySaveOrder(order) {
    try{
        await order.save();
    } catch (error){
        //TODO: add here async function to return tickets to event
        throw new HttpError(500, "failed to save order");
    }
}
