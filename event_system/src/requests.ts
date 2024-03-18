import scrabedIUser from "../../src/models/user.js";
import axios, { Axios, AxiosResponse } from 'axios';
import { GET_USER , LOGIN } from "../../src/const.js"
import { Swipe } from "@mui/icons-material";
// import * as dotenv from "dotenv";
// dotenv.config();
// TODO: repalce with dotenv
const GATEWAY_URL = "http://localhost:3000";




export const sendRequest = async (url: string, method: string, body: Object | null = null): Promise<AxiosResponse  | null>  => {
    try{
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
                return null;
        }
        return response;

    } catch(error){
        return null;
    }
};


export const getUserById = async(userId: String):Promise<typeof scrabedIUser | null> => {
    const getuser_split = GET_USER.split(' ');
    const url = `${GATEWAY_URL}${getuser_split[1]}${userId}`
    const method = getuser_split[0];
    try{
        const response = await sendRequest(url, method);
        return response?.data;
    }catch(error){
        return null;
    }
};

export const login = async(username: String, password: String):Promise<typeof scrabedIUser | null> => {
    const body = {
        "username": username,
        "password": password
      };
    try{
        const login_split = LOGIN.split(' ');
        const url = GATEWAY_URL+login_split[1];
        const response = await sendRequest(url, login_split[0], body);
        return response?.data;
    }catch(error){
        return null;
    }
};
