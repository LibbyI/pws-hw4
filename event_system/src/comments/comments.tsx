import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Icomment} from '../../../src/models/comments';
import {Comment} from './comment';

export const AlignItemsList: React.FC= () => {

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        
        {examplearry.map((commentObj, index) => (
        <React.Fragment key={index}>
          <Comment commentObj={commentObj} />
          {index !== examplearry.length - 1 && <Divider variant="inset" component="li" />} {/* Add Divider between items, except for the last one */}
        </React.Fragment>
      ))}  
    </List>
  );
}

 

const examplearry: Icomment[] = [{ _id: "123",
    eventId: "456",
    author: "libby",
    date: new Date("2023-01-07T00:00:00.000Z"),
    content: "fgsfgsgsfgzfsg"}, { _id: "123",
    eventId: "456",
    author: "nao",
    date: new Date("2023-01-07T00:00:00.000Z"),
    content: "great!!"}] 


export default AlignItemsList;
