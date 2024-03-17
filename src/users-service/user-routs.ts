import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import express from "express";
import User from "../models/user.js";
import userSchema from "../models/user.js";


const users = User;

export const getUser = async(req_username: string):Promise<string> | null => {
    try{
        const user = await users.findOne({username : req_username}).exec();
        return user._id.toString();
    } catch(error){
        return null;
    }
}

export const permissionRoute = async(req: express.Request, res: express.Response) =>{

    if (!(req.body.username && req.body.permission)){
        res.statusCode = 400;
        res.send(JSON.stringify({message: "BadRequest.", }));
        return;
      }
    let userId = await getUser(req.body.username);
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
        res.statusCode = 400;
        res.send(JSON.stringify({message: "username is already exsist",}))
      }
}