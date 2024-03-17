import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from "cors";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.GATEWAY_PORT;



app.get('/users', (req, res) => {
  res.redirect('http://localhost:3002/users');

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