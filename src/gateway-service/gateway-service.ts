import express, { Application } from "express";
import * as dotenv from "dotenv";
import axios from 'axios';
import { updateEventDateValidator } from "./requestsValidators.js";
import { validationResult } from "express-validator";
import { protectedRout, getUserPermission } from './auth.js'
import  cookieParser from 'cookie-parser';
import { HttpError } from "../orders-service/order-error.js";

dotenv.config();
const app = express();
app.use(express.json())
app.use(cookieParser());

const port = process.env.GATEWAY_PORT;
const users_url = process.env.USERS_SERVICE_URL;
const comments_url = process.env.COMMENTS_SERVICE_URL;
const orders_url = process.env.ORDERS_SERVICE_URL;




app.use(function (req, res, next) {

  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');


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

 app.get('/isBackoffice/:id', async(req,res) => {
  try{
    const id = req.params.id;
    const userPermission = await getUserPermission(id);
    res.status = 200;
    if (userPermission == null){
      throw new HttpError(400, "  ERROR GET USER PERMISSIONS");
    }
    // ad  if premission == null
    if (userPermission != "None"){
      res.send(JSON.stringify({backoffice: true,}));
      return;
    }
    res.send(JSON.stringify({backoffice: false,}));
    return;
    
  }catch(error){
    res.status(400).send(JSON.stringify({message: "bad requst",}));

  }
 }) 

app.post('/api/signup', async(req, res) => {
  try{
    const response = await axios.post(`${users_url}/signup`, req.body);
    if (response.status == 200){
      res.status(response.status).send(response.data);
    }
    else{
      res.status(response.status).send(response.data);

    } 
  } catch(error){
    res.status(500).send(error);
  }

});

app.post('/api/login', async(req, res) => {
  try{
    const response = await axios.post(`${users_url}/login`, req.body);
    if (response.status == 200){
      // const new_token = response.data.token;
      const new_token = 'Bearer ' + response.data.token;
      res.cookie('token', new_token, { httpOnly: true , sameSite: 'none', secure: true});
      res.status(response.status).send(response.data);
    }
    else{
      res.status(response.status).send(response.data);

    } 
  } catch(error){
    res.status(500).send(error);
  }
});

app.post('/api/logout', async(req, res) => {
  try{
      res.clearCookie('token');
      res.status(200).send(); 
    } catch(error){
      res.status(500).send(error);
    }
});

app.get('/api/user/:id' , async(req, res) => {
  try{
    const id = req.params.id;
    const response = await axios.get(`${users_url}/${id}`);
    res.status(response.status).send(response.data);
  }catch(error){
    res.status(500).send(error);
  }
});

app.put('/api/permissions', async (req, res) => {
  try{
    const response = await axios.put(`${users_url}/permissions`);
    res.status(response.status).send(response.data);
  }catch(error){
    res.status(500).send(error);
  }
});


/****************************Events*********************************/
app.get('/events', async (req, res) => {
  try{
    // const cookieValue = req.cookies['token'];
    const user = await protectedRout(req, res);
    if (!user){
      return;
    }
    const response = await axios.get(`http://localhost:3001/?availableOnly=${req.query.availableOnly}`);
    res.status(response.status).send(response.data);
  }catch(error){
    res.status(500).send(error);
  }
});

app.get('/events/:id', async (req, res) => {
  // res.redirect(`http://localhost:3001/${req.params.id}`);
  try{
    // const cookieValue = req.cookies['token'];
    const response = await axios.get(`http://localhost:3001/${req.params.id}`);
    res.status(response.status).send(response.data);
  }catch(error){
    res.status(500).send(error);
  }
});

app.post('/events', async (req, res) => {
  // res.redirect(307,'http://localhost:3001/');
  try{
    // const cookieValue = req.cookies['token'];
    const response = await axios.post('http://localhost:3001/', req.body);
    res.status(response.status).send(response.data);
  }catch(error){
    res.status(500).send(error);
  }
});


app.patch('/tickets/:eventId', async (req, res) => {
  // res.redirect(`http://localhost:3001/tickets/${req.params.eventId}`);
  try{
    // const cookieValue = req.cookies['token'];
    const response = await axios.patch(`http://localhost:3001/tickets/${req.params.eventId}`, req.body);
    res.status(response.status).send(response.data);
  }catch(error){
    res.status(500).send(error);
  }
});

app.patch('/events/date/:eventId', updateEventDateValidator, async(req, res) => {
  // TODO: permissions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg);
  }
  // res.redirect(307,`http://localhost:3001/date/${req.params.eventId}`);
  try{
    // const cookieValue = req.cookies['token'];
    const response = await axios.patch(`http://localhost:3001/date/${req.params.eventId}`, req.body);
    res.status(response.status).send(response.data);
  }catch(error){
    res.status(500).send(error);
  }

});

  /****************************Comments*********************************/
  
  app.get('/comments/:id', async (req, res) => {
    try{
      const id = req.params.id;
      // res.redirect(`${comments_url}/${id}`);
      // const cookieValue = req.cookies['token'];
      const response = await axios.get(`${comments_url}/${id}`);
      res.status(response.status).send(response.data);
    }catch(error){
      res.status(500).send(error);
    }
  });

  app.post('/addComment', async (req, res) => {
    // res.redirect(307, `${comments_url}`);
    try{
      const response = await axios.post(`${comments_url}`, req.body);
      res.status(response.status).send(response.data);
    }catch(error){
      res.status(500).send(error);
    }
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  /********************************Orders*******************************/

  app.post('/orders',async (req, res) => {
    // res.redirect(307, `${orders_url}/`);
    try{
      const response = await axios.post(`${orders_url}/`, req.body);
      res.status(response.status).send(response.data);
    }catch(error){
      res.status(500).send(error);
    }
  });

  app.post('/pay', async (req, res) => {
    // res.redirect(307, `${orders_url}/pay`);
    try{
      const response = await axios.post(`${orders_url}/pay`, req.body);
      res.status(response.status).send(response.data);
    }catch(error){
      res.status(500).send(error);
    }
  });

  app.get('/orders/:id',async (req, res) => {
    // res.redirect(`${orders_url}/${req.params.id}`);
    try{
      const response = await axios.get(`${orders_url}/${req.params.id}`);
      res.status(response.status).send(response.data);
    }catch(error){
      res.status(500).send(error);
    }
  });