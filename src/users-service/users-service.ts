import express, { Application } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { options } from '../const.js';
import User from "../models/user.js";
import { signupRoute, permissionRoute, loginRoute, getUser, getUserById} from "./user-routs.js";

dotenv.config();

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbURI, options);
const users = User;

const app = express();
const port = process.env.USERS_PORT;

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


app.get('/:id', async(req, res) => {
  const id = req.params.id;
  await getUserById(req, res);

});

app.post('/signup', async(req, res) => {
    await signupRoute(req, res);
  });

app.post('/login', async(req, res) => {
  await loginRoute(req, res);
});


  app.put('/permissions', async(req, res) => {
    let body = req.body;
    permissionRoute(req, res)
  });


  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });