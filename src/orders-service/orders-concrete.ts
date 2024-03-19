import axios, { AxiosError } from "axios";
import OrderType from "../models/orders.js";


export async function addNewOrder(req,res) {
    try {
        const order = validateAndGetOrder(req,res);
        await tryGetTicketsFromEvent(order, res);
        await trySaveOrder(order, res);
    } catch (error) {
        console.log(error);
        return;
    }
    }

function validateAndGetOrder(req,res){
    try{
        const order = new OrderType(req.body);
        order.validateSync();
        return order;
    }
    catch (error){
        if (error.name === "ValidationError"){
            res.status(400).send(error.message);
          }
          else{
            res.status(500).send(error.message);
        }
        throw new Error("failed to validate order");
    }};

async function tryGetTicketsFromEvent(order, res){
    try{
        await axios.patch(`${process.env.GATEWAY_URL}/tickets/${order.event_id}`, {name: order.ticket.name, quantity: -order.ticket.quantity});
    } catch (error: AxiosError | any){
        if (error instanceof AxiosError) {
            res.status(error.response.status).send(error.response.data);
        } else {
            console.log(error);
            res.status(500).send("failed to get tickets from event");
        }

        throw new Error("failed to get tickets from event");
       
    }
}
async function trySaveOrder(order, res) {
    try{
        await order.save();
        res.send(order);
    } catch (error){
        //TODO: add here async function to return tickets to event
        res.status(500).send("failed to save order");
        throw new Error("failed to save order");
    }
}

