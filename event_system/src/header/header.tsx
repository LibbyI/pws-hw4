import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { permissionValidTypes, scrabedIUser } from "../../../backend/src/models/user.ts";
import {getUserById} from "../common/requests.ts";
import { useNavigate, useParams } from 'react-router-dom';
import { useState , useEffect } from 'react'

interface Props{
    goback: () => void;
    logout: () => void;
    getUser: () => scrabedIUser | null;
  };



export const ButtonAppBar: React.FC<Props> = ({goback, logout, getUser}) => {
    // const user = getUser();
  const { userId, permissionType } = useParams();
  const [user, setUser] = useState<any>(null); // Define user state

  if(!userId || !permissionType){
      return <h1>Invalid URL</h1>
  }
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
    <Box sx={{ flexGrow: 1, pt:0, pb: 5 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            hello {user?.username}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Next Event is: {user?.nextEvent?.title}
          </Typography>
          <div style={{ flexGrow: 1 }} /> 
          {
            [permissionValidTypes.Admin , permissionValidTypes.Manager].includes(permissionType as permissionValidTypes) ? <Button color="inherit" onClick={() => {navigate(`/${userId}/${permissionType}/newEvent`)}}>CREATE EVENT</Button> : <></>
          }
          <Button color="inherit" onClick={() => {goback();}}>GO BACK</Button>
          <Button color="inherit" onClick={() => {logout();}}>LOGOUT</Button>



        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
