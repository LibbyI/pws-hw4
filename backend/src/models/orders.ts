import { Ticket } from "./event.js";
import {IEvent} from "./event.js"
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
    _id ?: string;
    event_id: string;
    user_id: string;
    ticket: Ticket;
    status?: orderStatus;
    expires_at?: Date; 
    paiment_token?: string;
}

export interface IuserOrder{
    userId : string;
    eventId: string;
    add: boolean;
  }


export interface IorderAndEvent{
    _id ?: string;
    ticket: Ticket;
    expires_at: Date;
    event: IEvent;
}
