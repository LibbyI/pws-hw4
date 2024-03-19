import express from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { options } from '../const.js';
import { addNewOrder } from "./orders-concrete.js";
import  OrderType  from "../models/orders.js";


dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.ORDERS_PORT;
export const orders = OrderType;

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbURI, options);

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

app.post('/', async (req, res) => {
    addNewOrder(req, res);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });