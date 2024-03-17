import express, { Application } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { options } from '../const.js';
import User from "../models/user.js";
import { signupRoute, permissionRoute } from "./user-routs.js";

dotenv.config();

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbURI, options);
const users = User;

const app = express();
app.use(express.json())
const port = process.env.USERS_PORT;


app.post('/signup', async(req, res) => {
  const resp = await signupRoute(req, res);
  console.log(resp);
  });


  app.put('/permissions', async(req, res) => {
    let body = req.body;
    permissionRoute(req, res)
  });


  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });