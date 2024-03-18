import * as mongoose from "mongoose";
import express from "express";
import userSchema from "../models/user.js";
import * as dotenv from "dotenv";
import CommentType, {Icomment} from "../models/comments.js";

const comments = CommentType;



export const addComent = async(req, res) => {
    try{
        const comment = new CommentType(req.body);
        await comment.validate();
        const result = await comment.save();
        res.send(result);  
    } catch(error){
        if (error.name === "ValidationError"){
            res.status(400).send(error.message);
          }
          else{
            res.status(500).send(error.message);
          }}
  
      }

export const getComments = async(req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        let filter : object = {eventId: id};
        const result = await comments.find(filter).exec();
        res.send(result);
      } catch (error) {
        res.status(500).send(error);
      }
}
