import * as dotenv from "dotenv";
dotenv.config();

export const POST_ORDER = "POST /api/order";
export const PUT_ITEM = "PUT /api/inventory";

export const GET_USER = `${process.env.GATEWAY_URL}/user/`;


export const options = {
    dbName: 'hw4', 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };