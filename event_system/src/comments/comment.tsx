import * as React from 'react';
// import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Icomment} from '../../../backend/src/models/comments';



interface Props{
    commentObj: Icomment;
  };


export const Comment: React.FC<Props>= ({commentObj}) => {
    return(
        <ListItem alignItems="flex-start">
        <ListItemText
          primary={commentObj.author}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {`${commentObj.content}     `}
              </Typography>
              {new Date(commentObj.date).toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'})}
            </React.Fragment>
          }
        />
      </ListItem>
      
    )
}

export default Comment;

