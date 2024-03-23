import express from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { options } from '../const.js';
import { addNewOrder, handlePaymentRequest, deleteExpiredOrder, cleanExpiredOrders , refundroute, getOrdersAggregateEvents } from "./orders-concrete.js";
import  OrderType  from "../models/orders-model.js";
import { HttpError } from "./order-error.js";
import { PublisherChannel } from './publisher-channel.js';
import {INTERVAL_CLEAN_TRIGGER} from "../const.js";

export const publisherChannel = new PublisherChannel();

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.ORDERS_PORT;
export const orders = OrderType;

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;

await mongoose.connect(dbURI, options);

setInterval(() => {
  console.log("interval func");
  cleanExpiredOrders();
}, INTERVAL_CLEAN_TRIGGER);


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
  try {
    const order = await addNewOrder(req.body);
    res.status(200).send(order);
    // TODO:REMOVE FROME HERE-> TO PAYMENT!!
    // await publisherChannel.sendUserNewEvnt(JSON.stringify({userId: order.user_id, eventId: order.event_id}));

    
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.message);
    }
    else{
      res.status(500).send(error.message);
    }
  }

});

app.get('/personalSpaceOrders/:id', async (req,res) => {
  try{
      await getOrdersAggregateEvents(req,res);

  }catch(error){
    res.status(500).send(error.message);
  }
})

// app.get('/delete/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const order = await deleteExpiredOrder(id);
//     res.status(200).send(order);
    
//   } catch (error) {
//     if (error instanceof HttpError) {
//       res.status(error.status).send(error.message);
//     }
//     else{
//       res.status(500).send("failed to delete order")
//     }
//   }

// });

app.delete('/refund/:id', async (req, res) => {
  await refundroute(req,res);
})

app.post('/pay', async (req, res) => {
  try {
    const order = await handlePaymentRequest(req);
    res.status(200).send(order);
    // await publisherChannel.sendUserNewEvnt(JSON.stringify({userId: req.body.order.user_id, eventId: req.body.order.event_id}));

  }
  catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.message);
    }
    else{
      res.status(500).send("failed to handle payment request")
    }
  }});


app.get('/:id', async (req, res) => {
  try {
    const result = await orders.findById(req.params.id).exec();
    res.send(result);
   } catch (error) {
     res.status(500).send(error);
   }
  
  });

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });