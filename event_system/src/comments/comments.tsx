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
import {getEventComments} from "../requests";
import { useEffect, useState } from 'react';


interface Props{
    eventId: String;
  };

export const AlignItemsList: React.FC<Props>= ({eventId}) => {
    const [commentsArray, setCommentsArray] = useState<any[]>([]);
    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await getEventComments(eventId);
            const comments = response?.data ;
            setCommentsArray(comments);
          } catch (error) {
            console.error('Error fetching comments:', error);
          }
        };
    
        fetchComments();
      }, [eventId]);

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            
            {commentsArray.map((commentObj, index) => (
            <React.Fragment key={index}>
            <Comment commentObj={commentObj} />
            {index !== commentsArray.length - 1 && <Divider variant="inset" component="li" />} {/* Add Divider between items, except for the last one */}
            </React.Fragment>
        ))}  
        </List>
    );
}

 

// const examplearry: Icomment[] = [{ _id: "123",
//     eventId: "456",
//     author: "libby",
//     date: new Date("2023-01-07T00:00:00.000Z"),
//     content: "fgsfgsgsfgzfsg"}, { _id: "123",
//     eventId: "456",
//     author: "nao",
//     date: new Date("2023-01-07T00:00:00.000Z"),
//     content: "great!!"}] 


export default AlignItemsList;
