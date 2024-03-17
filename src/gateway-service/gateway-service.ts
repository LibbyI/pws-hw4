import express, { Application } from "express";
import * as dotenv from "dotenv";


dotenv.config();
const app = express();
const port = process.env.PORT;





app.get('/events', (req, res) => {
    res.redirect('http://localhost:3001/events');

    // req.url = '/api/user';
    // next()
    // res.send('Express + TypeScript Server');
  });

app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });