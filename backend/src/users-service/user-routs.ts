import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import express from "express";
import User from "../models/user-model.js";
import userSchema from "../models/user-model.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { scrabedIUser , IUser } from '../models/user.js';
import { boolean } from "joi";
import { IuserOrder } from "../models/orders.js";
import axios from "axios";
import { IEvent } from "../models/event.js"
import { send } from "process";
dotenv.config();
import {permissionValidTypes} from "../models/user.js"
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

export const addRemoveMsgSwitch = async(msg: IuserOrder): Promise<boolean>=>{
  try{
    if (msg.add == true){
      console.log("msg.add",msg.add)
      const bool = await addEvent(msg);
      return bool;
    }else{
      const bool = await removeEvent(msg);
      return bool;

    }
  }catch(error){
    return false;
  }
}

export const removeEvent = async (msg: IuserOrder): Promise<boolean> => {
  try{
    console.log(msg.userId,msg.eventId)
   
    const user = await users.findById(msg.userId);
    const indexToRemove = user.eventIds.indexOf(msg.eventId);
    if (indexToRemove !== -1) {
        user.eventIds.splice(indexToRemove, 1);
    }
    await user.save();

    if(user.nearestEvent._id == msg.eventId){
      // check nearest
      const eventReqs = user.eventIds.map(event_id => axios.get(process.env.EVENTS_SERVICE_URL+"/"+event_id));
      const eventResps = await Promise.all(eventReqs);
      const eventList = eventResps.map(response => {return response.data;});
      const nearest = getNearest(eventList);
      user.updateOne({"nearestEvent": nearest});
      return true;
    }
    else{
      return true;
    }
  }catch(error){
    return false;
  }
  return true;
}

export const addEvent = async (msg: IuserOrder): Promise<boolean> => {
  try{
    console.log(msg.userId,msg.eventId)
    const user = await users.findByIdAndUpdate({_id: msg.userId},{ $push: { eventIds: msg.eventId } },
      { new: true });
    const checkNearest = await isNewEventNearest(msg)
    if (!checkNearest) {
      return false;
    }
  }catch(error){
    return false;
  }
  return true;
}

export const isNewEventNearest = async (msg: IuserOrder) =>{
  try{
    const newEvent = await axios.get(process.env.EVENTS_SERVICE_URL+"/"+msg.eventId);
    const user = await users.findById({_id: msg.userId}).exec();
    if ((user.eventIds).length == 1){
      await user.updateOne({"nearestEvent": newEvent.data});
      return true;
    }
    if ((user.eventIds).length == 0){
      return true;
    }
    if (!user.nearestEvent){
      
      // check for all events: for now->
      const eventReqs = user.eventIds.map(event_id => axios.get(process.env.EVENTS_SERVICE_URL+"/"+event_id));
      const eventResps = await Promise.all(eventReqs);
      const eventList = eventResps.map(response => {return response.data;});
      const nearest = getNearest(eventList);
      user.updateOne({"nearestEvent": nearest});
      // await user.updateOne({"nearestEvent": newEvent.data});
      return true;

    }
    if(new Date(user.nearestEvent.start_date) > new Date(newEvent.data.start_date)){
      await user.updateOne({"nearestEvent": newEvent.data});
      return true;
    }
    return true;
  }catch(error){
    console.error(error);
    return false;
  }
}

export const isUpdatedEventNearest = async (eventId: string) =>{

  try{
    const newEvent = await axios.get(process.env.EVENTS_SERVICE_URL+"/"+eventId);
    const possibleEffectedUsers = await users.find({ eventIds: { $in: [eventId] } }).exec();
    const usersIds = possibleEffectedUsers.map(user => user._id.toString());
    console.log(usersIds);
    for(const userObj of  possibleEffectedUsers){
      if (!userObj.nearestEvent || userObj.nearestEvent._id == newEvent.data._id){
        // check all
        const uniqueEventIds = [...new Set(userObj.eventIds)];
        const eventReqs = uniqueEventIds.map(event_id => axios.get(process.env.EVENTS_SERVICE_URL+"/"+event_id));
        const eventResps = await Promise.all(eventReqs);
        const eventList = eventResps.map(response => {return response.data;});
        const nearest = getNearest(eventList);
        userObj.updateOne({"nearestEvent": nearest});
      }
    }
    return true;
  }catch(error){
    console.error(error);
    return false;

  }
}

export const getNearest = (eventList: IEvent[]) =>{
  const earliestDateObject = eventList.reduce((earliest, current) => {
    // Convert date strings to Date objects for comparison
    const earliestDate = new Date(earliest.start_date);
    const currentDate = new Date(current.start_date);

    // Return the object with the earlier date
    return earliestDate < currentDate ? earliest : current;
  }, eventList[0]);
  return earliestDateObject;
}

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
      nextEvent: user.nearestEvent,
      permission: user.permission
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
    if (!userId || userId == null){
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
      try{
        const user_exsit = await users.findOne({username: username}).exec();
        if (user_exsit){
          return res.status(400).send({
            message: "Username already exists."
        });
        }
      }catch(error){
        res.status(500).send(JSON.stringify({message: "error connection to db",}));
        return;
      }
      const password = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: `${username}`,
        password: `${password}`,
        permission: permissionValidTypes.User
      });
      try{
        await newUser.save();
        res.statusCode = 201; // Created a new user!
        res.send(JSON.stringify({username, }));
      }catch(error){
        // res.statusCode = 400;
        res.status(400).send(JSON.stringify({message: "username is already exsist",}));
        return;
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
    if (!userId || userId == null){
      res.statusCode = 404;
      res.send(JSON.stringify({message: "username dosent exsist",}));
      return;
    }
    let user;
    try{
        user = await users.findOne({_id: userId}).exec();

    }catch(error){
        res.statusCode = 404;
        res.send(JSON.stringify({message: "username dosent exsist",}));
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
    permission: user.permission
    }

    res.status(200).send(
        JSON.stringify(userdetails)
    );
    
}


