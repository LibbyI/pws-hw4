import * as React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

// import {Comment} from './comment';
import {Detaile} from './order-details.tsx'
import { getUserPersonalSpace} from "../common/requests.js";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// import {getUserById} from "../common/requests.js"
// interface Props{
//     getUser: () => scrabedIUser | null;
//     logout: () => void;
//   };

export const DetailedList: React.FC= () => {
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
