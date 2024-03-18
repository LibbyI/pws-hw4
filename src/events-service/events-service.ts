import express from "express";
import * as dotenv from "dotenv";
import EventType from "../models/event.js";
import * as mongoose from "mongoose";



dotenv.config();
const app = express();
const port = process.env.EVENTS_PORT;

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
import { options } from '../const.js';

await mongoose.connect(dbURI, options);


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
    console.log(req.body.name, req.body.quantity, req.params.id);
    const result = await events.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { "tickets.$[elem].quantity": req.body.quantity } },
      { arrayFilters:[{ "elem.name": req.body.name }] ,
        returnDocument: "after"}
  );
  res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch('/date/:id', (req, res) => {
});

  
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
