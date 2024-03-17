import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import axios from 'axios';



dotenv.config();
const app = express();
app.use(express.json())

const port = process.env.GATEWAY_PORT;
const users_url = process.env.USERS_SERVICE_URL;


// TODO: check if cors is allowed
const corsOptions = {
  origin: 'http://localhost:5173',
};

app.use(cors({
  origin: 'http://localhost:5173'
}));


app.post('/api/signup', cors(corsOptions) , async(req, res) => {
  try{
    const response = await axios.post(`${users_url}/signup`, req.body);
    
    // console.log(response);
    res.status(response.status).send(response.data);

  } catch(error){
    // console.log(error.response);
    res.status(500).send(error);
  }
});

app.post('/api/login', cors(corsOptions) , async(req, res) => {
  try{
    const response = await axios.post(`${users_url}/login`, req.body);
    
    res.status(response.status).send(response.data);

  } catch(error){
    res.status(500).send(error);
  }
});

app.put('/api/permissions', (req, res) => {
  res.redirect(`${users_url}/permissions`);
});

app.get('/events', (req, res) => {
  res.redirect('http://localhost:3001/');
});

app.post('/events', (req, res) => {
  res.redirect('http://localhost:3001/');
});

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});


  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });