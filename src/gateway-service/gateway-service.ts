import express, { Application } from "express";
import * as dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(express.json())

const port = process.env.GATEWAY_PORT;
const users_url = process.env.USERS_SERVICE_URL;



app.post('/api/signup', (req, res) => {
  res.redirect(`${users_url}/signup`);
});

app.put('/api/permissions', (req, res) => {
  res.redirect(`${users_url}/permissions`);
});

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