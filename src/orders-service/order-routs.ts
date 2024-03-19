import { PublisherChannel } from './publisher-channel.js';
import {updateEventTickets, orederExpiredDate} from "../const.js";
import OrderType, { IOrder, orderStatus, paymentDetails } from "../models/orders.js";
import orders from "../models/orders.js";
import {publisherChannel} from "./orders-service.js"

export const sendMessageUpdateTickets = async (publisher: PublisherChannel, eventId: string, quantity: number, name: string) =>{
    const body: updateEventTickets = {
        eventId: eventId,
        quantity: quantity,
        name: name
      }
      const res = await publisher.sendEvent(JSON.stringify(body));

      return res;
}

export const sentTimeOutMessage = async (publisher: PublisherChannel, orderId: string, date: Date) =>{
    const body: orederExpiredDate = {
        orderId: orderId,
        expiredDate: date,
      }
      const res = await publisher.sendEventtimeout(JSON.stringify(body));

      return res;
}

export async function findanddelete(msg: orederExpiredDate){
  //if expaierd and pending => delete it and remove from queue
  const deletedOrder = await orders.findOneAndDelete({_id: msg.orderId, status: orderStatus.pending, expires_at: {$lte: new Date()}});
  // else: find it
  if (deletedOrder){
    console.log("deleted order!!",deletedOrder);
    await sendMessageUpdateTickets(publisherChannel, deletedOrder.event_id, deletedOrder.ticket.quantity, deletedOrder.ticket.name);
    return true;
  }

  const oreder = await orders.findOne({_id: msg.orderId});
  if (!oreder){
    console.log("order not found");
    return true;
  }
  switch (oreder.status){
      // if completed? remove from queue
      case orderStatus.completed:
        return true;
        break;
      // else, if in paiment , back to queue (update expired date)
      case orderStatus.inPayment:
        return false;
        break;
      //else if pending: back to queue update date:
      case orderStatus.pending:
        return false;
        break;
  }
}