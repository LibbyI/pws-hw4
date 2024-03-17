import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import  SignUp from './signup/SignUp.tsx'

function App() {
  type pageState = 'signup' | 'login';
  const [page, setPage] = useState<pageState>('signup');

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
