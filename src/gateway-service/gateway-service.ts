import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import axios from 'axios';



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.GATEWAY_PORT;


// TODO: check if cors is allowed
const corsOptions = {
  origin: 'http://localhost:5173',
};

app.get('/users', (req, res) => {
  res.redirect('http://localhost:3002/users');
app.use(cors({
  origin: 'http://localhost:5173'
}));


app.post('/api/signup', cors(corsOptions) , async(req, res) => {
  try{
    const response = await axios.post(`${users_url}/signup`, req.body);
    
    // console.log(response);
    // res.status(response.status).send(response.data);

  } catch(error){
    console.log(error);
    res.status(error.status).send(error.message);
  }
});

  // req.url = '/api/user';
  // next()
  // res.send('Express + TypeScript Server');
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
  

export default app;