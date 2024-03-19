import axios, { AxiosError } from "axios";
import OrderType, { IOrder, orderStatus, paymentDetails } from "../models/orders.js";
import orders from "../models/orders.js";
import { HttpError } from "./order-error.js";
import { PAYMENT_URL } from "../const.js";


export async function addNewOrder(req) : Promise<IOrder> {
        const order = validateAndGetOrder(req);
        await tryGetTicketsFromEvent(order);
        await trySaveOrder(order);
        //TODO: send message to delete order when expired.
        return order;
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
