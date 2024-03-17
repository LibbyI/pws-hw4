import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import  SignUp from './signup/SignUp.tsx'
import { pageState } from '../entities.ts'

function App() {
  pageState: pageState;
  const [page, setPage] = useState<pageState>(pageState.signup);

  // const endsignup = () => { 
  //   setPage('login');
  // };
  // const [count, setCount] = useState(0)
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
