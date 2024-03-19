import express, { Application } from "express";
import * as dotenv from "dotenv";
import axios from 'axios';
import { updateEventDateValidator } from "./requestsValidators.js";
import { validationResult } from "express-validator";
import { protectedRout, getUserPermission } from './auth.js'


dotenv.config();
const app = express();
app.use(express.json())

const port = process.env.GATEWAY_PORT;
const users_url = process.env.USERS_SERVICE_URL;
const comments_url = process.env.COMMENTS_SERVICE_URL;




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


 app.get('/api/test', async(req,res) => {
  const user = await protectedRout(req, res);
  if (!user){
    return;
  }
  const userPermission = await getUserPermission(user.id);
  res.status = 200;
  
  res.send(JSON.stringify({userPermission: userPermission,}));

 }) 

app.post('/api/signup', async(req, res) => {
  res.redirect(307, `${users_url}/signup`);

});

app.post('/api/login', async(req, res) => {
  res.redirect(307, `${users_url}/login`);
});

app.get('/api/user/:id' , async(req, res) => {
  const id = req.params.id;
  res.redirect(`${users_url}/${id}`);
});

app.put('/api/permissions', (req, res) => {
  res.redirect(`${users_url}/permissions`);
});


/****************************Events*********************************/
app.get('/events', (req, res) => {
  res.redirect(`http://localhost:3001/?availableOnly=${req.query.availableOnly}`);
});

app.get('/events/:id', (req, res) => {
  res.redirect(`http://localhost:3001/${req.params.id}`);
});

app.post('/events', (req, res) => {
  console.log(req.body);
  res.redirect(307,'http://localhost:3001/');
});


app.patch('/tickets/:eventId', (req, res) => {
  res.redirect(`http://localhost:3001/tickets/${req.params.eventId}`);
});

app.patch('/events/date/:eventId', updateEventDateValidator, (req, res) => {
  // TODO: permissions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg);
  }
  res.redirect(307,`http://localhost:3001/date/${req.params.eventId}`);
});

  /****************************Comments*********************************/
  
  app.get('/comments/:id', (req, res) => {
    const id = req.params.id;
    res.redirect(`${comments_url}/${id}`);

  });

  app.post('/addComment', (req, res) => {
    res.redirect(307, `${comments_url}`);
  });


  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

