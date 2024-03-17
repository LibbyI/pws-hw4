import express, { Application } from "express";
import * as dotenv from "dotenv";


dotenv.config();
export const app = express();
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
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });