import { useState } from 'react'
import './App.css'
import  SignUp from './signup/SignUp.tsx'
import  SignIn from './signin/SignIn.tsx'

import { pageState } from '../entities.ts'
import React from "react";
import { HashRouter as Router, Route, Link, BrowserRouter, Routes } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import { CatalogPage } from './catalog/catalogPage.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/catalog" element={<CatalogPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />)
export default App
