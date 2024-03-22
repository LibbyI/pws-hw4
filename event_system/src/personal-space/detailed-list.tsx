import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Icomment} from '../../../backend/src/models/comments';

// import {Comment} from './comment';
import {Detaile} from './order-details.js'
import {getEventComments, getUserPersonalSpace} from "../common/requests.js";
import { useEffect, useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import {sendEventComment} from "../common/requests.js";
import { scrabedIUser } from "../../../backend/src/models/user.js";
import { useParams } from 'react-router-dom';
import { getCookies } from '../common/utils.js';
import {IorderAndEvent} from '../../../backend/src/models/orders';

// import {getUserById} from "../common/requests.js"
interface Props{
    getUser: () => scrabedIUser | null;
    logout: () => void;
  };

export const DetailedList: React.FC<Props>= ({getUser, logout}) => {
    const { userId } = useParams();
    const [ordersArray, setordersArray] = useState<any[]>([]);
    const fetchOrders = async () => {
        try {
            if (userId){
                const response = await getUserPersonalSpace(userId);
                const order_list = response?.data ;
                if (response == null){
                    setordersArray([]);
                }else{
                    setordersArray(order_list);
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    
    useEffect(() => {
        fetchOrders();
      }, [userId]);



    return (
        <List sx={{ width: '100%',  bgcolor: 'background.paper' }}>
            {ordersArray.map((commentObj, index) => (
            <React.Fragment key={index}>
            <Detaile detailsObj={commentObj} />
            {index !== ordersArray.length - 1 && <Divider variant="inset" component="li" />} {/* Add Divider between items, except for the last one */}
            </React.Fragment>
        ))}  
        <Divider variant="inset" component="li" />
        </List>
    );
}

 

// const examplearry: Icomment[] = [{
//     eventId: "456",
//     author: "libby",
//     date: new Date("2023-01-07T00:00:00.000Z"),
//     content: "fgsfgsgsfgzfsg"}, {
//     eventId: "456",
//     author: "nao",
//     date: new Date("2023-01-07T00:00:00.000Z"),
//     content: "great!!"}] 


// export default AlignItemsList;
