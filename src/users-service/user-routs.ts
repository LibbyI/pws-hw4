import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import express from "express";
import User from "../models/user.js";
import userSchema from "../models/user.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { scrabedIUser , IUser } from '../models/user.js';
import { boolean } from "joi";
import { IuserOrder } from "../models/orders.js";
import axios from "axios";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const users = User;

export const getUserId = async(req_username: string):Promise<string> | null => {
    try{
        const user = await users.findOne({username : req_username}).exec();
        return user._id.toString();
    } catch(error){
        return null;
    }
}

export const addEvent = async (msg: IuserOrder): Promise<boolean> => {
  try{
    console.log(msg.userId,msg.eventId)
    const user = await users.findByIdAndUpdate({_id: msg.userId},{ $push: { eventIds: msg.eventId } },
      { new: true });
    if (!await isNewEventNearest(msg)){
      return false;
    }
  }catch(error){
    return false;
  }
  return true;

}

export const isNewEventNearest = async (msg: IuserOrder) =>{
  try{
    const newEvent = await axios.get(process.env.GATEWAY_URL+"/events/"+msg.eventId);
    const user = await users.findById({_id: msg.userId}).exec();
    if ((user.eventIds).length == 1){
      await user.updateOne({"nearestEvent": newEvent.data});
      return;
    }
    if (!user.nearestEvent){
      // check for all events: for now->
      await user.updateOne({"nearestEvent": newEvent.data});
      return;

    }
    if(new Date(user.nearestEvent.start_date) > newEvent.data.start_date){
      await user.updateOne({"nearestEvent": newEvent.data});
      return;
    }
  }catch(error){
    console.error(error);
    return false;
  }
}

// export const isUpdatedEventNearest = async (eventId: string) =>{
//   try{
//     const updatedEvent = await axios.get(process.env.GATEWAY_URL+"/events/:"+msg.eventId);
//     const user = await users.findById({_id: msg.userId}).exec();
//     if(updatedEvent.data._id == user.nearestEvent._id){
//       const eventReqs = user.eventIds.map(event_id => axios.get(process.env.GATEWAY_URL+"/events/:"+msg.event_id));
//       const events = await Promise.all(eventReqs);
//       //check all
//       // await user.update({"nearestEvent": newEvent.data});
//       return;
//     }
//     if ((user.eventIds).length == 1){
//       await user.update({"nearestEvent": updatedEvent.data});
//       return;
//     }

//   }catch(error){
//     console.error(error);
//   }
// }

export const getUserById = async(req: express.Request, res: express.Response): Promise<scrabedIUser | null> => {
  try{
    const id = req.params.id;
    const user = await users.findOne({_id : id}).exec();
    if (!user){
        res.status(404).send({message: "user not found"});
        return;
    }
    const scrabediuser: scrabedIUser ={
      id: user.id,
      username: user.username,
      eventIds: user.eventIds,
      token: null,
      nextEvent: null
    }
    res.status(200).send(JSON.stringify(scrabediuser));
    return scrabediuser;   
  } catch(error){
      res.status(400).send("error");
      return;

    } 
}

const getUserFromDb = async(req, res): Promise<IUser | null> => {
  try{
    const id = req.params.id;
    const user = await users.findOne({_id : id}).exec();
    if (!user){
        res.status(404).send({message: "user not found"});
        return;
    }
    return user;   
  } catch(error){
      res.status(400).send("error");
      return;

    } 

}


export const permissionRoute = async(req: express.Request, res: express.Response) =>{

    if (!(req.body.username && req.body.permission)){
        res.statusCode = 400;
        res.send(JSON.stringify({message: "BadRequest.", }));
        return;
      }
    let userId = await getUserId(req.body.username);
    if (!userId){
        res.statusCode = 404;
        res.send(JSON.stringify({message: "user dosent exist.", }));
        return;
    }
    try{
        await users.findOneAndUpdate({_id: userId}, {permission: req.body.permission });
        res.statusCode = 200;
        res.send("permission changed");
        return;
    } catch(error){
        res.statusCode = 400;
        res.send(JSON.stringify({message: error, }));
        return;
    }
}

export const getPremission = async(req: express.Request, res: express.Response) =>{
  try{
    const user = await getUserFromDb(req,res);
    return user?.permission;
  }catch(error){
    return null;
  }
}

export const signupRoute = async(req: express.Request, res: express.Response) => {
    if (!(req.body.username && req.body.password)){
        res.statusCode = 400;
        res.send(
          JSON.stringify({
            message: "BadRequest.",
          })
        );
      }
      const username = req.body.username;
      const password = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: `${username}`,
        password: `${password}`,
        permission: "None"
      });
      try{
        await newUser.save();
        res.statusCode = 201; // Created a new user!
        res.send(JSON.stringify({username, }));
      }catch(error){
        // res.statusCode = 400;
        res.status(400).send(JSON.stringify({message: "username is already exsist",}));
      }
}


export const loginRoute = async(req: express.Request, res: express.Response) => {
    if (!(req.body.username && req.body.password)){
        res.statusCode = 400;
        res.send(
          JSON.stringify({
            message: "BadRequest.",
          })
        );
      }
    const username = req.body.username;
    const password = req.body.password;
    const userId = await getUserId(username);
    if (!userId){
    res.status(404).send(JSON.stringify({message: "username dosent exsist",}));
    return;
    }
    let user;
    try{
        user = await users.findOne({_id: userId}).exec();

    }catch(error){
        res.status(404).send(JSON.stringify({message: "username dosent exsist",}));
        return;
    }
    const passwordMatch = await bcrypt.compare(
        password,
        user.password
        
    );

    if (!passwordMatch) {
      res.statusCode = 401;
      res.send(
        JSON.stringify({
          message: "Invalid username or password.",
        })
      );
      return;
    }
    const token = jwt.sign({ id: user.toObject()._id}, secretKey, {
        expiresIn: 86400, // expires in 24 hours
      });
    const userdetails: scrabedIUser = {id: user.id, username: user.username,
    eventIds: user.eventIds,
    token: token,
    nextEvent: null,
    }

    res.status(200).send(
        JSON.stringify(userdetails)
    );
    
}


