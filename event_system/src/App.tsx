// import { useState } from 'react'
import './App.css'
import  SignUp from './signup/SignUp.tsx'
import  SignIn from './signin/SignIn.tsx'

// import { pageState } from '../entities.ts'
// import React from "react";
import { Route, BrowserRouter, Routes } from 'react-router-dom';
// import { HashRouter as Router, Route, Link, BrowserRouter, Routes } from 'react-router-dom';

// import ReactDOM from "react-dom/client";
import { CatalogPage } from './catalog/catalogPage.tsx';
import { scrabedIUser } from "../../backend/src/models/user.ts";

import { EventPage } from './event-page/event-page.tsx';
import { CheckoutPage } from './checkout-page/checkout-page.tsx'
import{ logoutreq } from "./common/requests.ts"
import {getCookies, setCookey} from "./common/utils.ts";
import { NewEventPage } from './new-event-page.tsx/new-event-page.tsx'
import {DetailedList} from "./personal-space/detailed-list.tsx"
import { RefundPage } from './refund/refund-page.tsx';
import Header from './header/header.tsx';
import { Cookie } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { get } from 'mongoose';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const logout = async () => {
      await logoutreq();
      var expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() - 10);
      setCookey("username", " ", expirationDate);
      setCookey("userId", " ", expirationDate);
      setCookey("permissionType", " ", expirationDate);
      window.location.href = "/";
  };
  
  useEffect(() => {

  },[isLoggedIn]);

  return (
    <BrowserRouter>
        {isLoggedIn ? <Header logout={logout}  /> : <></>}


      <Routes>
        
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn}/>}></Route>

        <Route path="/:userId/:permissionType/catalog" element={<CatalogPage logout={logout} />}></Route>
        <Route path="/:userId/:permissionType/event/:eventId" element={<EventPage logout={logout}/>}></Route>
        <Route path="/:userId/:permissionType/checkout/:orderId" element={<CheckoutPage/>}></Route>
        <Route path="/:userId/:permissionType/newEvent" element={<NewEventPage/>}></Route>
        <Route path="/:userId/:permissionType/personalSpace" element={<DetailedList />}></Route>
        <Route path="/:userId/:permissionType/refund" element={<RefundPage />}></Route>      
        
      </Routes>

    </BrowserRouter>
  );
}
export default App
