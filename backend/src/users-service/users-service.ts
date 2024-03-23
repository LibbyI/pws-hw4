import express, { Application } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { options } from '../const.js';
import User from "../models/user-model.js";
import { signupRoute, permissionRoute, loginRoute, getUserById, getPremission} from "./user-routs.js";
import { consumeMessages } from './consumer-messages.js';
consumeMessages();

dotenv.config();

const gateway_url = process.env.GATEWAY_URL;
const app_url = process.env.APP_URL;

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbURI, options);
const users = User;

const app = express();
const port = process.env.USERS_PORT;

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', [gateway_url, app_url]);


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
  console.log("got login req in user service")
  await loginRoute(req, res);
});


  app.put('/permissions', async(req, res) => {
    await permissionRoute(req, res)
  });

  app.get('/permissions/:id', async(req, res) => {
    const userPermission = await getPremission(req, res);
    res.status = 200;
    res.send(JSON.stringify({permission: userPermission}))

  });

  // app.patch('/addevent', async(req, res) => {
  //   await addevent(req, res);
  // });


  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });