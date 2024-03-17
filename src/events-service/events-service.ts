import express, { Application } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";

dotenv.config();
const app = express();
const port = process.env.EVENTS_PORT;

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
import { options } from '../const.js';
await mongoose.connect(dbURI, options);

import Event from "../models/event.js";
const events = Event;

app.get('/events', (req, res) => {
    res.send('EVENTS');
  });
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });