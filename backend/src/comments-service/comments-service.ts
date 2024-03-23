import express, { Application } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { options } from '../const.js';
import CommentType from "../models/comments-model.js";
import { addComent, getComments, getCommentsCount} from "./comment-routs.js";

dotenv.config();

const dbURI = `mongodb+srv://libby6831:${process.env.DB_PASS}@cluster0.pyjnubc.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbURI, options);
const comments = CommentType;

const app = express();
const port = process.env.COMMENTS_PORT;

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
  
app.use(express.json());

  
app.post('/', async(req, res) => {
    await addComent(req, res);
});

  
app.get('/:id', async(req, res) => {
    await getComments(req, res);
});

app.get('/count/:id', async(req, res) => {
  await getCommentsCount(req, res);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });