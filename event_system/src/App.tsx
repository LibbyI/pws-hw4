import { useState } from 'react'
import './App.css'
import  SignUp from './signup/SignUp.tsx'
import { pageState } from '../entities.ts'
import React from 'react';

function App() {
  pageState: pageState;
  const [page, setPage] = useState<pageState>(pageState.signup);


  if (page == 'signup'){
    return (
      <>
        <SignUp></SignUp>  
      </>
    )
  }
  else{
    return(
      <>
      <h1>not signup</h1>

      </>
    )
  }
  
}

export default App
