import express, { Application } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";

dotenv.config();



// const dbURI = `mongodb+srv://libby6831:3q3qYJe12oRnH6ao@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;

await mongoose.connect(dbURI);

import User from "../models/user.js";
const users = User;



dotenv.config();
const app = express();
const port = process.env.USERS_PORT;


app.get('/users', async(req, res) => {
  let user;
  try{
    let user = await users.findOne({_id : "65e499c98bd84059ad63a970"}).exec();
    res.send(user.username);


  } catch(error){
    res.statusCode = 404;
    res.end(JSON.stringify({message: "item not found",}));
    return;
  }
    res.send('users');
  });
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });