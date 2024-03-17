import express, { Application } from "express";
import * as dotenv from "dotenv";


dotenv.config();
const app = express();
const port = process.env.EVENTS_PORT;




app.get('/events', (req, res) => {
    res.send('EVENTS');
  });
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });