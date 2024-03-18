import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import axios from 'axios';
import { updateEventDateValidator } from "./requestsValidators.js";
import { validationResult } from "express-validator";



dotenv.config();
const app = express();
app.use(express.json())

const port = process.env.GATEWAY_PORT;
const users_url = process.env.USERS_SERVICE_URL;


// TODO: check if cors is allowed
// const corsOptions = {
//   origin: 'http://localhost:5173',
// };

// app.use(cors({
//   origin: 'http://localhost:5173'
// }));
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



app.post('/api/signup', async(req, res) => {
  res.redirect(307, `${users_url}/signup`);

});

app.post('/api/login', async(req, res) => {
  res.redirect(307, `${users_url}/login`);
});

app.get('/api/user/:id' , async(req, res) => {
  try{
    const id = req.params.id;
    const response = await axios.get(`${users_url}/${id}`);
    res.status(response.status).send(response.data);

  } catch(error){
    res.status(500).send(error);
  }
});

app.put('/api/permissions', (req, res) => {
  res.redirect(`${users_url}/permissions`);
});


/****************************Events*********************************/
app.get('/events', (req, res) => {
  res.redirect(`http://localhost:3001/?availableOnly=${req.query.availableOnly}`);
});

app.post('/events', (req, res) => {
  res.redirect('http://localhost:3001/');
});


app.patch('/tickets/:eventId', (req, res) => {
  res.redirect(`http://localhost:3001/tickets/${req.params.eventId}`);
});

app.patch('/events/date/:eventId', updateEventDateValidator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg);
  }
  res.redirect(307,`http://localhost:3001/date/${req.params.eventId}`);
});

  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
