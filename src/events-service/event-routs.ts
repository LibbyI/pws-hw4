import {updateEventTickets} from "../const.js";
import axios  from 'axios';
import  { AxiosResponse, AxiosRequestHeaders }  from 'axios';


export const updateTicketsAmount = async(eventTicket: updateEventTickets): Promise<number> => {
    console.log(eventTicket);
    const status = 200;
    return status;
}