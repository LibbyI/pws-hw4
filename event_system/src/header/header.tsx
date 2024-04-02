import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { permissionValidTypes } from "../../../backend/src/models/user.ts";
import {getUserById} from "../common/requests.ts";
import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from 'react'
import { getCookies, isBackoffice } from '../common/utils.ts';

interface Props{
    logout: () => void;
    isLoggedIn: boolean;
  };

export const Header: React.FC<Props> = ({logout, isLoggedIn}) => {
  if(!isLoggedIn){
    console.log("Not logged in");
    return <></>;
  }
  const userId = getCookies("userId");
  const permissionType = getCookies("permissionType") as permissionValidTypes;

  const [user, setUser] = useState<any>(null); // Define user state

  const navigate = useNavigate();
  useEffect(() => {

  
    const fetchUser = async () => {
      try {
        if(userId){
          const userResp = await getUserById(userId);
          setUser(userResp?.data);
        }
        else{
          throw Error;
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, []);

  return (
    <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            hello {user?.username}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Next Event is: {user?.nextEvent?.title}
          </Typography>
          <div style={{ flexGrow: 1 }} /> 
          {
            [permissionValidTypes.Admin , permissionValidTypes.Manager].includes(permissionType) ?
             <Button color="inherit" onClick={() => {navigate(`/newEvent`)}}>CREATE EVENT</Button> : 
             <></>
          }
          {
            isBackoffice(permissionType) ? <></> :
            <>
            <Button color="inherit" onClick={() => {navigate(`/personalSpace`)}}>PERSONAL SPACE</Button>
            <Button color="inherit" onClick={() => {navigate(`/refund`)}}>Refund</Button>
            </>

          }
          <Button color="inherit" onClick={() => {navigate(-1);}}>GO BACK</Button>
          <Button color="inherit" onClick={() => {logout();}}>LOGOUT</Button>
        </Toolbar>
      </AppBar>
  );
}

export default Header;
