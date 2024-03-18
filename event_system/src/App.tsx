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



function App() {

  const [userState, setUserState] = useState<scrabedIUser>({id: null, username: null,
    eventIds: null,
    token: null})

  const logout = () => {
    setUserState({id: null, username: null,
      eventIds: null,
      token: null});
  };
  const setUserFunc = (userDetails: scrabedIUser ) => {
    setUserState(userDetails);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn setUser={setUserFunc}/>}></Route>
        <Route path="/catalog" element={<CatalogPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />)
export default App
