import { PublisherChannel } from './publisher-channel.js';
import {updateEventTickets, orederExpiredDate} from "../const.js";


export const sendMessageUpdateTickets = async (publisherChannel: PublisherChannel, eventId: string, quantity: number, name: string) =>{
    const body: updateEventTickets = {
        eventId: eventId,
        quantity: quantity,
        name: name
      }
      const res = await publisherChannel.sendEvent(JSON.stringify(body));

      return res;
}

export const sentTimeOutMessage = async (publisherChannel: PublisherChannel, orderId: string, date: Date) =>{
    const body: orederExpiredDate = {
        orderId: orderId,
        expiredDate: date,
      }
      const res = await publisherChannel.sendEventtimeout(JSON.stringify(body));

      return res;
}