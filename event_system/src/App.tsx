import { useState } from 'react'
import './App.css'
import  SignUp from './signup/SignUp.tsx'
import  SignIn from './signin/SignIn.tsx'

import { pageState } from '../entities.ts'
import React from "react";
import { HashRouter as Router, Route, Link, BrowserRouter, Routes } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import { CatalogPage } from './catalog/catalogPage.tsx';
import { permissionValidTypes, scrabedIUser } from "../../backend/src/models/user.js";
import { EventPage } from './event-page/event-page.tsx';
import { CheckoutPage } from './checkout-page/checkout-page.tsx'
import{ logoutreq } from "./common/requests.ts"
import {setCookey} from "./common/utils.ts";
 
import { makeStyles } from '@mui/material'

function App() {
  let userState = localStorage.getItem("userState");
  if (userState == null)
    {
      const userState: scrabedIUser = {id: null, username: null,
          eventIds: null,
          token: null,
          nextEvent: null,
          permission: "None"};
      localStorage.setItem("userState", JSON.stringify(userState));
    }
  const setUserState = (newuserstate: scrabedIUser) =>{
    localStorage.setItem("userState", JSON.stringify(newuserstate));
  }
  const getUserState = (): scrabedIUser | null=>{
    try{
      let userStateString = localStorage.getItem("userState");
      if (userStateString){
        const userStateObject: scrabedIUser = JSON.parse(userStateString);
        return userStateObject;
      }
    }catch(error){
      return null;
    }
    return null;
  }
  const logout = async () => {
    setUserState({id: null, username: null,
      eventIds: null,
      token: null,
      nextEvent: null,
      permission: "None"});
      await logoutreq();
      var expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() - 10);
      setCookey("username", " ", expirationDate);
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn setUser={setUserState}/>}></Route>
        <Route path="/:userId/:permissionType/catalog" element={<CatalogPage logout={logout} getUser={getUserState}/>}></Route>
        <Route path="/:userId/:permissionType/event/:eventId" element={<EventPage logout={logout} getUser={getUserState}/>}></Route>
        <Route path="/:userId/:permissionType/checkout/:orderId" element={<CheckoutPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />)
export default App
