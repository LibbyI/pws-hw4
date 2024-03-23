import mongoose from "mongoose";
import { Ticket } from "./event.js";
import { TIMEOUT } from "../const.js";
// import { TIMEOUT } from "../src/const.js";
import {IEvent} from "./event.js"
import {IOrder, orderStatus} from "./orders.js"
// 





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
        expires_at: { type: Date, required: true, default : new Date(Date.now() + TIMEOUT) },
        paiment_token: {type: String, required: false, default: " "}
    });

export default mongoose.model<IOrder>("OrderType", orderSchema, 'orders');