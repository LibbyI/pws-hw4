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
import {getEventComments} from "../common/requests.js";
import { useEffect, useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import {sendEventComment} from "../common/requests.js";
import { scrabedIUser } from "../../../src/models/user.js";
import { useParams } from 'react-router-dom';
// import {getUserById} from "../common/requests.js"
interface Props{
    eventId: String;
    getUser: () => scrabedIUser | null;

  };

export const AlignItemsList: React.FC<Props>= ({eventId, getUser}) => {
    // const { userId } = useParams();
    const [commentsArray, setCommentsArray] = useState<any[]>([]);
    const fetchComments = async () => {
        try {
            const response = await getEventComments(eventId);
            const comments = response?.data ;
            setCommentsArray(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    

    const handleAddComment = async  (event: React.FormEvent<HTMLFormElement>) => {
        // TODO: GET USER NAME!!!
        event.preventDefault();
        const user = getUser();
        let username;
        if (user && user.username){
            username = user.username;
        }else{
            username = "Anonymous";
        }
        const data = new FormData(event.currentTarget);
        const content = data.get('newComment')?.toString();
        if (content){
            try{
                const newComment: Icomment = {eventId: eventId.toString(), author: username.toString(), content: content, date: new Date() };
                const response = await sendEventComment(newComment);
                console.log(response);
                fetchComments();

            }catch(error){
                console.error('Error post comment', error);
            }
        }
    };
    useEffect(() => {
        fetchComments();
      }, [eventId]);



    return (
        <List sx={{ width: '100%',  bgcolor: 'background.paper' }}>
            
            {commentsArray.map((commentObj, index) => (
            <React.Fragment key={index}>
            <Comment commentObj={commentObj} />
            {index !== commentsArray.length - 1 && <Divider variant="inset" component="li" />} {/* Add Divider between items, except for the last one */}
            </React.Fragment>
        ))}  
        <Divider variant="inset" component="li" />
        <form onSubmit={handleAddComment}>
          <TextField
            id="new-comment"
            name='newComment'
            label="Add a comment"
            variant="outlined"
            fullWidth
            // Here you can add state to manage the new comment text
            // For example, value={newCommentText} onChange={handleCommentTextChange}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Comment
          </Button>
        </form>

        </List>
    );
}

 

const examplearry: Icomment[] = [{
    eventId: "456",
    author: "libby",
    date: new Date("2023-01-07T00:00:00.000Z"),
    content: "fgsfgsgsfgzfsg"}, {
    eventId: "456",
    author: "nao",
    date: new Date("2023-01-07T00:00:00.000Z"),
    content: "great!!"}] 


export default AlignItemsList;
