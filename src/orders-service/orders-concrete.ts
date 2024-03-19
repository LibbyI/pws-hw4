import axios, { AxiosError } from "axios";
import OrderType, { IOrder, orderStatus } from "../models/orders.js";
import orders from "../models/orders.js";
import { HttpError } from "./order-error.js";


export async function addNewOrder(req,res): Promise<IOrder | null> {
        const order = validateAndGetOrder(req);
        await tryGetTicketsFromEvent(order);
        await trySaveOrder(order);
        //TODO: send message to delete order when expired.
        return order;
    }

export async function handlePaymentRequest(req,res) {
    try {
        //get and update order status to in payment
        req.body.order.status = orderStatus.inPayment;
        let order = await orders.findOneAndUpdate({_id: req.body.order._id}, {status: "inPayment"}).exec()??
        addNewOrder(req,res);
    } catch (error) {
        console.log(error);
        return null;
    }
    
}

function validateAndGetOrder(req){
    try{
        const order = new OrderType(req.body);
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

