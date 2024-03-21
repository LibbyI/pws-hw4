import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { scrabedIUser } from "../../../src/models/user.ts";


interface Props{
    goback: () => void;
    logout: () => void;
    getUser: () => scrabedIUser | null;
  };

export const ButtonAppBar: React.FC<Props> = ({goback, logout, getUser}) => {
    const user = getUser();
  return (
    <Box sx={{ flexGrow: 1, pt:0, pb: 5 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            hello {user?.username}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Next Event is: {user?.nextEvent}
          </Typography>
          <div style={{ flexGrow: 1 }} /> 

          <Button color="inherit" onClick={() => {goback();}}>GO BACK</Button>
          <Button color="inherit" onClick={() => {logout();}}>LOGOUT</Button>

        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
