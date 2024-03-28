import axios, { AxiosResponse } from 'axios';
import { GET_USER , LOGIN ,LOGOUT, SIGNUP , GET_COMMENTS, ADD_COMMENT} from "../../../backend/src/const.js"
import {Icomment} from "../../../backend/src/models/comments.js"
import { IOrder,paymentDetails } from "../../../backend/src/models/orders.js";
import { IEvent } from "../../../backend/src/models/event.js";
import { isElementOfType } from 'react-dom/test-utils';
// import * as dotenv from "dotenv";
// dotenv.config();
// TODO: repalce with dotenv
// const GATEWAY_URL = "http://localhost:3000";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;



export const sendRequest = async (url: string, method: string, body: Object | null = null): Promise<AxiosResponse>  => {
        // const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL;
        // const GATEWAY_URL = "http://localhost:3000";

        let response;
        switch(method){
            case 'GET':
                response = await axios.get(GATEWAY_URL+url, {
                    withCredentials: true
                  });
                break;
            case 'POST':
                
                 response = await axios.post(GATEWAY_URL+url, body, {
                    withCredentials: true
                  });
                 break;
            case 'PUT':
                 response = await axios.put(GATEWAY_URL+url, body,{
                    withCredentials: true
                  });
                 break;
            case 'PATCH':
                 response = await axios.patch(GATEWAY_URL+url, body,{
                    withCredentials: true
                  });
                 break;
            case 'DELETE':
                response = await axios.delete(GATEWAY_URL+url,{
                    withCredentials: true
                });
                break;
            default:
                throw new Error('Invalid method');
        }
        // console.log(response);

        return response; 
};

export const getEventComments = async(eventId: String):Promise<AxiosResponse | null> => {

    try{
        const comments_split = GET_COMMENTS.split(' ');
        const url = comments_split[1]+eventId;
        console.log(url);
        const response = await sendRequest(url, comments_split[0]);
        console.log(response);
        return response;
        
    }catch(error){
        return null;
    }
};
export const getEventCommentsCount = async(eventId: string):Promise<AxiosResponse | null> => {
    try{
        const url = `/comments/count/${eventId}`;
        const response = await sendRequest(url, "GET");
        return response;
        
    }catch(error){
        return null;
    }
};

export const sendEventComment = async(comment: Icomment):Promise<AxiosResponse | null> => {
    try{
        const body = comment;
        const comment_split = ADD_COMMENT.split(' ');
        const url = comment_split[1];
        console.log(url,comment_split[0] , body);
        const response = await sendRequest(url, comment_split[0], body);
        return response;
        
    }catch(error){
        return null;
    }
};

export const getUserById = async(userId: String):Promise<AxiosResponse | null> => {
    const getuser_split = GET_USER.split(' ');
    const url = `${getuser_split[1]}${userId}`
    const method = getuser_split[0];
    try{
        const response = await sendRequest(url, method);
        return response;
    }catch(error){
        return null;
    }
};

export const login = async(username: String, password: String):Promise<AxiosResponse | null> => {

    const body = {
        "username": username,
        "password": password
      };
    try{
        const login_split = LOGIN.split(' ');
        const url = login_split[1];
        const response = await sendRequest(url, login_split[0], body);
        return response;
        
    }catch(error){
        console.error("error loging in");
        throw error;
    }
};

export const logoutreq = async():Promise<AxiosResponse | null> => {
    const body = {};
    try{
        const logout_split = LOGOUT.split(' ');
        const url = logout_split[1];
        const response = await sendRequest(url, logout_split[0], body);
        return response;
        
    }catch(error){
        return null;
    }
};


export const signup = async(username: String, password: String):Promise<AxiosResponse | null> => {
    const body = {
        "username": username,
        "password": password
      };
    try{
        const signup_split = SIGNUP.split(' ');
        const url = signup_split[1];
        const response = await sendRequest(url, signup_split[0], body);
        return response;
    }catch(error){
        if (axios.isAxiosError(error)) {
            console.log(error.response)
            const res  = error.response as AxiosResponse;
            return res;
        }else{
            return null;

        }

    }
};

export const getEvents = async(availableOnly: Boolean):Promise<AxiosResponse> => {
        const url = `/events?availableOnly=${availableOnly}`;
        const response = await sendRequest(url, 'GET');
        return response;

};

export const getEventById = async(eventId: String):Promise<AxiosResponse> => {
        const url = `/events/${eventId}`;
        const response = await sendRequest(url, 'GET');
        return response;
};

export const placeNewOrder = async(order: IOrder):Promise<AxiosResponse> => {
        const url = `/orders`;
        const response = await sendRequest(url, 'POST', order);
        return response;
}

export const getOrderById = async(orderId: String):Promise<AxiosResponse> => {
        const url = `/orders/${orderId}`;
        const response = await sendRequest(url, 'GET');
        return response;
}

export const getUserPermission = async(userId: String):Promise<boolean> => {
    const url = `/isBackoffice/${userId}`;
    const response = await sendRequest(url, 'GET');
    console.log(response);
    return response.data.backoffice;
}

export const payOnOrder = async(order: IOrder, paymentDetails: paymentDetails):Promise<AxiosResponse | null > => {
    try {
        const url = `/pay`;
        const body = {
            order: order,
            paymentDetails: paymentDetails
        };
        const response = await sendRequest(url, 'POST', body);
        return response;
    } catch (error) {
      return null;  
    }

}

export const updateEventDate = async(eventId: string, startDate: Date, endDate: Date):Promise<AxiosResponse | null> => {
    try {
        const url = `/events/date/${eventId}`;
        const body = {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        };
        const response = await sendRequest(url, 'PATCH', body);
        return response;
    } catch (error) {
        return null;
    }
}

export const addNewEvent = async(event: IEvent):Promise<AxiosResponse | null> => {
        const url = `/events`;
        const body = {...event, start_date: event.start_date.toISOString().split('T')[0], end_date: event.end_date.toISOString().split('T')[0]}
        const response = await sendRequest(url, 'POST', body);
        return response;
}

export const getUserPersonalSpace = async(userId: string):Promise<AxiosResponse | null> => {
    try {
        const url = `/personalSpaceOrders/${userId}`;
        const response = await sendRequest(url, 'GET');
        return response;
    } catch (error) {
        return null;
    }
}

export const refundOrder = async(orderId: string):Promise<AxiosResponse | null> => 
{
    const url = `/refund/${orderId}`;

    const response = await sendRequest(url, 'DELETE');

    return response;
}