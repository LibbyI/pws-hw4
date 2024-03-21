import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ReactDOM from "react-dom/client";
import { CatalogPage } from './pages/catalogPage.tsx';
import { HashRouter as Router, Route, Link, BrowserRouter, Routes } from 'react-router-dom';
import { scrabedIUser } from "../../src/models/user.ts";


function App() {

  const getUserState = (): scrabedIUser | null=>{
    return null;
  }
  const logout = () => {
    window.location.href = `http://localhost:5173/signin`;
  };
  return (
    <>
      <BrowserRouter>
      <Routes>        
        <Route path="/:userId/catalog" element={<CatalogPage logout={logout} getUser={getUserState}/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
