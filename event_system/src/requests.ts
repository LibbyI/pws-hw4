import scrabedIUser from "../../src/models/user.js";
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { GET_USER , LOGIN , SIGNUP , GET_COMMENTS, ADD_COMMENT} from "../../src/const.js"
import { Swipe } from "@mui/icons-material";
import {Icomment} from "../../src/models/comments.js"
import { IOrder } from "../../src/models/orders.js";
// import * as dotenv from "dotenv";
// dotenv.config();
// TODO: repalce with dotenv
const GATEWAY_URL = "http://localhost:3000";




export const sendRequest = async (url: string, method: string, body: Object | null = null): Promise<AxiosResponse>  => {
    
        let response;
        switch(method){
            case 'GET':
                response = await axios.get(url);
                break;
            case 'POST':
                 response = await axios.post(url, body);
                 break;
            case 'PUT':
                 response = await axios.put(url, body);
                 break;
            case 'PATCH':
                 response = await axios.patch(url, body);
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
        const url = GATEWAY_URL+comments_split[1]+eventId;
        const response = await sendRequest(url, comments_split[0]);
        return response;
        
    }catch(error){
        return null;
    }
};

export const sendEventComment = async(comment: Icomment):Promise<AxiosResponse | null> => {
    try{
        const body = comment;
        const comment_split = ADD_COMMENT.split(' ');
        const url = GATEWAY_URL+comment_split[1];
        const response = await sendRequest(url, comment_split[0], body);
        return response;
        
    }catch(error){
        return null;
    }
};

export const getUserById = async(userId: String):Promise<AxiosResponse | null> => {
    const getuser_split = GET_USER.split(' ');
    const url = `${GATEWAY_URL}${getuser_split[1]}${userId}`
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
        const url = GATEWAY_URL+login_split[1];
        const response = await sendRequest(url, login_split[0], body);
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
        const url = GATEWAY_URL+signup_split[1];
        const response = await sendRequest(url, signup_split[0], body);
        return response;
    }catch(error){
        return null;
    }
};

export const getEvents = async(availableOnly: Boolean):Promise<AxiosResponse> => {
        const url = `${GATEWAY_URL}/events?availableOnly=${availableOnly}`;
        const response = await sendRequest(url, 'GET');
        return response;

};

export const getEventById = async(eventId: String):Promise<AxiosResponse> => {
        const url = `${GATEWAY_URL}/events/${eventId}`;
        const response = await sendRequest(url, 'GET');
        return response;
};

export const placeNewOrder = async(order: IOrder):Promise<AxiosResponse> => {
        const url = `${GATEWAY_URL}/orders`;
        const response = await sendRequest(url, 'POST', order);
        return response;
}

export const getOrderById = async(orderId: String):Promise<AxiosResponse> => {
        const url = `${GATEWAY_URL}/orders/${orderId}`;
        const response = await sendRequest(url, 'GET');
        return response;
}

export const getUserPermission = async(userId: String):Promise<boolean> => {
    const url = `${GATEWAY_URL}/isBackoffice/${userId}`;
    const response = await sendRequest(url, 'GET');
    return response.data.backoffice;
}