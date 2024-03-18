import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { ERROR_401 } from "../const.js";

// import User from "./models/user.js";
import { verify } from "crypto";
import express, { Application } from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const users_url = process.env.USERS_SERVICE_URL;


// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY;

// TODO: Replace with your user database
// const users = User;

// Verify JWT token
const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
    // Read more here: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    // Read about the diffrence between jwt.verify and jwt.decode.
  } catch (err) {
    return false;
  }
};

// Middelware for all protected routes. You need to expend it, implement premissions and handle with errors.
export const protectedRout = (req: express.Request, res: express.Response) => {
  let authHeader = req.headers["authorization"] as string;

  // authorization header needs to look like that: Bearer <JWT>.
  // So, we just take to <JWT>.
  // TODO: You need to validate it.
  let authHeaderSplited = authHeader && authHeader.split(" ");
  const token = authHeaderSplited && authHeaderSplited[1];



  if (!token) {
    res.status = 401;
    res.send(
      JSON.stringify({
        message: "No token.",
      })
    );
    return;
  }
  // Verify JWT token
  const user = verifyJWT(token);
  if (!user) {
    res.status = 401;
    res.send(
      JSON.stringify({
        message: "Failed to verify JWT.",
      })
    );
    return;
  }

  // We are good!
  return user;
};

export const getUserPermission = async(id: string) =>{
  try{
    const userPremission = await axios.get(`${users_url}/permissions/${id}`);
    return userPremission?.data.permission;

  }catch(error){
    return null;
  }
}