import express from "express";
import * as dotenv from "dotenv";
import EventType from "../models/event.js";
import * as mongoose from "mongoose";
import { body, query } from "express-validator";

dotenv.config();
const app = express();
const port = process.env.EVENTS_PORT;

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
import { options } from '../const.js';

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

app.use(express.json());
const events = EventType;


app.get('/', async (req, res) => {
  try {
    const availableOnly:boolean = req.query.availableOnly;
    let filter : object = availableOnly === true ? {isAvailable: availableOnly} : {};
   const result = await events.find(filter).exec();
   res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
  });

app.get('/:id', async (req, res) => {
  try {

    const result = await events.findById(req.params.id).exec();
    res.send(result);
   } catch (error) {
     res.status(500).send(error);
   }
});

app.post('/', async (req, res) => {
  try{
    const event = new EventType(req.body);
    event.isAvailable = event.tickets.some((ticket) => ticket.quantity > 0);
    await event.validate();
    const result = await event.save();
    res.send(result);
  }
  catch (error){
    if (error.name === "ValidationError"){
      res.status(400).send(error.message);
    }
    else{
      res.status(500).send(error.message);
    }}

});


app.patch('/tickets/:id', async (req, res) => {
  try {
    const result = await events.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { "tickets.$[elem].quantity": req.body.quantity } },
      { arrayFilters:[{$and:[ {"elem.name": req.body.name} , {"elem.quantity": {$gte: -req.body.quantity}}]}]});
      if (result.tickets.filter((t)=> t.name === req.body.name)[0].quantity < -req.body.quantity){
        res.status(400).send("not enough tickets");
      }
      console.log(result);

  res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.patch('/date/:id', async (req, res) => {
  try {
    console.log(req.body.start_date);
    const result = await events.findByIdAndUpdate(req.params.id, {start_date: new Date(req.body.start_date), end_date: new Date(req.body.end_date)});
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }

});

  
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
