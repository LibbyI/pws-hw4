import axios, { AxiosError } from "axios";
import { IOrder, orderStatus, paymentDetails, IorderAndEvent } from "../models/orders.js";
import OrderType from "../models/orders-model.js"
import {scrabedIUser} from "../models/user.js";
import {IEvent} from "../models/event.js";
import orders from "../models/orders-model.js";
import events from "../models/events-model.js";
import * as mongoose from "mongoose";
import { ClientSession } from "mongoose";
import * as dotenv from "dotenv";

import { HttpError } from "./order-error.js";
import { PAYMENT_URL , PAYMENT_REFUND_URL } from "../const.js";
import {orederExpiredDate} from "../const.js";
import { stat } from "fs";
dotenv.config();
import {publisherChannel} from "./orders-service.js"
import exp from "constants";
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
        return order;
    }





export async function deleteExpiredOrder(orderId: string, status: orderStatus) : Promise<IOrder | null> {
    const db = await mongoose.createConnection(dbURI).asPromise();
    const session = await db.startSession();
    session.startTransaction();
    let deleted_oreder = null;
    try{
        const result_order = await orders.findOneAndDelete(
            { _id: orderId ,expires_at: {$lte: new Date()}, status: status}).exec();
            // { arrayFilters:[{$and:[ {"status": orderStatus.pending}, {"expires_at":{$lte: new Date()}} ]}]}).exec();
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
        if (result_event.tickets.filter((t)=> t.name === result_order.ticket.name).length === 0){
            throw new HttpError(404, "Ticket not found");
        }
        await session.commitTransaction()
    }catch(error ){
        await session.abortTransaction();
        throw error;
        return;
    } finally{
        session.endSession();
    }
    return deleted_oreder;
}

export const cleanExpiredOrders = async () => {
    console.log("---start cleaning----");
    try{
        let expiredOrder = await orders.find({expires_at: {$lte: new Date()} , status: orderStatus.pending}).exec();
        console.log("found: ",  expiredOrder.length, " expired orders that need to be deleted");
        const orderIds = expiredOrder.map(order => order._id.toString());
        const deletePromises = orderIds.map(orderId => deleteExpiredOrder(orderId, orderStatus.pending));
        try {
            await Promise.all(deletePromises);
            console.log('All expired orders deleted successfully');
        } catch (error) {
            console.error('Error deleting expired orders:', error);
        }
        return;

    }catch(error){
        return;
    }
}

export async function handlePaymentRequest(req) {
        //lock order tickets
        // req.body.order.status = orderStatus.inPayment;
        let order = await orders.findOne({_id: req.body.order._id}).exec()??
        await addNewOrder(req.body.order);
        if (order.status == orderStatus.completed){
            throw new HttpError(400, "order allready comleted"); 
            return;
        }
        const orderId =  order._id
        //try pay
        const db = await mongoose.createConnection(dbURI).asPromise();
        const session: ClientSession = await db.startSession();
        let paymentId;

        session.startTransaction();
        try{
            // TODO-change req.body.order._id to order._id 
            let order = await orders.findOneAndUpdate({_id: orderId, status: "pending"}, {status: "inPayment"}).exec()??
            await addNewOrder(req.body.order);  
         
            const paymentDetails : paymentDetails = {charge: order.ticket.price * order.ticket.quantity, ...req.body.payment_details};
            paymentId = (await axios.post(PAYMENT_URL, paymentDetails)).data;
            // console.log(paymentId.paymentToken, typeof paymentId.paymentToken);

            // console.log(order._id);
            await orders.updateOne({_id: order._id}, {status: "completed", paiment_token: paymentId.paymentToken}).exec();//TODO: maybe sould be async            
            await publisherChannel.sendUserNewEvnt(JSON.stringify({userId: req.body.order.user_id, eventId: req.body.order.event_id, add: true}));

            await session.commitTransaction();
        }catch(error){
            await session.abortTransaction();
            if (error instanceof AxiosError) {
                throw new HttpError(error.response.status, error.response.data);
            } 
            else{
                throw new HttpError(500, "payment failed"); 

            }
            // console.log(error);
            // throw error;
        } finally{
            session.endSession();
        }
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


export const getOrdersAggregateEvents = async (req, res) =>{
    try{
        const id = req.params.id;
        const user: scrabedIUser = (await axios.get(`${process.env.USERS_SERVICE_URL}/${id}`)).data;
        const eventReqs = user.eventIds.map(event_id => axios.get(process.env.EVENTS_SERVICE_URL+"/"+event_id));
        const eventResps = await Promise.all(eventReqs);
        const eventList: IEvent[] = eventResps.map(response => {return response.data;});

        const user_orders = await orders.find({user_id: id}).exec()

        const combinedAndSort = aggragate(user_orders, eventList);
        res.status(200).send(combinedAndSort) ;
        return;

    }catch(error){
        res.status(500).send(JSON.stringify({message: "failed to get events"}));
    }

}

const aggragate = (user_orders: IOrder[] , user_events: IEvent[]) => {
    try{
        let aggregated: IorderAndEvent[] = [];;
        for(const orderObj of  user_orders){
            const event = user_events.find(event => event._id === orderObj.event_id);
            if(event){
                const agg: IorderAndEvent = {_id: orderObj._id, ticket:orderObj.ticket, event: event, expires_at: orderObj.expires_at};
                aggregated.push(agg);
            }
        }
        //sort:
        aggregated.sort((eventA, eventB) => {
            if(eventA.event?.start_date && eventB.event?.start_date){
                const dateA: Date = new Date(eventA.event.start_date);
                const dateB: Date = new Date(eventB.event.start_date);
                if (dateA < dateB) {
                    return -1;
                } else if (dateA > dateB) {
                    return 1;
                } else {
                    return 0;
                }
            }else{
                return 0;
            }   
        });
        console.log("sorted");
        return aggregated;
    }catch(error){
        console.log(error);
        throw error;
    }
    
 
    // IorderAndEvent
}


export const refundroute = async (req ,res) => {
    try{
        const id = req.params.id;
        const order: IOrder = await orders.findOne({_id: id}).exec();
        if(!order){
            res.status(404).send(JSON.stringify({message: "order id not found"}));
            return;
        }
        const eventObj = await axios.get(`${process.env.EVENTS_SERVICE_URL}/${order.event_id}`);
        if (eventObj.status != 200){
            res.status(404).send(JSON.stringify({message: "event id not found"}));
            return
        }
        if(new Date(eventObj.data.start_date) < new Date()){
            res.status(400).send(JSON.stringify({message: "order start date in the pass"}));
            return;
        }
        // order exist and in the future:
        const daletedOrder = await atomicrefund(order._id.toString(), order.paiment_token);
        if (!daletedOrder){
            res.status(500).send(JSON.stringify({message: "refund didnt sucsseed"}));
            return;
        }
        res.status(200).send(JSON.stringify({message: "refund succssess"}))
        // return daletedOrder;

    }catch(error){
        if (error instanceof HttpError) {
            res.status(error.status).send(error.message);
            return;
        }else{
            res.status(500).send(JSON.stringify({message: "somethig went wrong"}));
            return;
        }
    }
}


export async function atomicrefund(orderId: string, paymentToken: string) : Promise<IOrder | null> {
    const db = await mongoose.createConnection(dbURI).asPromise();
    const session = await db.startSession();
    session.startTransaction();
    let result_order = null;
    try{
        result_order = await orders.findOneAndDelete({ _id: orderId}).exec();
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
        if (result_event.tickets.filter((t)=> t.name === result_order.ticket.name).length === 0){
            throw new HttpError(404, "Ticket not found");
        }
        try{
            let refundpermit = await axios.post(PAYMENT_REFUND_URL, {orderId: paymentToken});
        }catch(error){
            try{
            let refundpermit = await axios.post(PAYMENT_REFUND_URL, {orderId: paymentToken});
            }catch(error){
                throw new HttpError(500, "refund didnt excepted");
            }
        }
        console.log("refund sucssess");
        // send message to user
        await publisherChannel.sendUserNewEvnt(JSON.stringify({userId: result_order.user_id, eventId: result_order.event_id, add: false}));

        await session.commitTransaction()
    }catch(error ){
        await session.abortTransaction();
        throw error;
        return;
    } finally{
        session.endSession();
    }
    return result_order;
}