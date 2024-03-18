import { useState } from 'react'
import './App.css'
import  SignUp from './signup/SignUp.tsx'
import  SignIn from './signin/SignIn.tsx'

import { pageState } from '../entities.ts'
import React from "react";
import { HashRouter as Router, Route, Link, BrowserRouter, Routes } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import { CatalogPage } from './catalog/catalogPage.tsx';
import { scrabedIUser } from "../../src/models/user.js";
import { EventPage } from './events/eventPage.tsx';



function App() {

  const [userState, setUserState] = useState<scrabedIUser>({id: null, username: null,
    eventIds: null,
    token: null})

  const logout = () => {
    setUserState({id: null, username: null,
      eventIds: null,
      token: null});
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn setUser={setUserState} userState={userState}/>}></Route>
        <Route path="/catalog" element={<CatalogPage/>}></Route>
        <Route path="/event" element={<EventPage userState={userState} logout={logout}/>}></Route>

      </Routes>
    </BrowserRouter>
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />)
export default App
