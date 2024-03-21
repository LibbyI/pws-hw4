import mongoose from "mongoose";
import { Ticket } from "./event.js";
import { TIMEOUT } from "../const.js";
// import { TIMEOUT } from "../src/const.js";
// 

export interface paymentDetails{
    cc: string;
    holder: string;
    cvv: string;
    exp: string;
    charge: number;
}



export enum orderStatus {
    pending = 'pending',
    inPayment = 'inPayment',
    completed = 'completed',
}

export interface IOrder{
    _id ?: mongoose.Types.ObjectId;
    event_id: string;
    user_id: string;
    ticket: Ticket;
    status?: orderStatus;
    expires_at?: Date; 
}

export interface IuserOrder{
    userId : mongoose.Types.ObjectId;
    eventId: string;
  }

const orderSchema = new mongoose.Schema<IOrder,mongoose.Model<IOrder>>(
    {
        event_id: { type: String, required: true  },
        user_id: { type: String, required: true },
        ticket: { type: {
            name: { type: String, required: true, minlength: [1, 'ticket type cant be empty'] },
            quantity: { type: Number, required: true, min: [1, 'cannot place order with no tickets'] },
            price: { type: Number, required: true, min: [0, 'ticket price must be greater than 0']}
        }, required: true },
        status: { type: String, required: true, enum: Object.values(orderStatus), default: orderStatus.pending},
        expires_at: { type: Date, required: true, default : new Date(Date.now() + TIMEOUT) }
    });

export default mongoose.model<IOrder>("OrderType", orderSchema, 'orders');