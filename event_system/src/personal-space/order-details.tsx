import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {IorderAndEvent} from '../../../backend/src/models/orders';



interface Props{
    detailsObj: IorderAndEvent;
  };


export const Detaile: React.FC<Props>= ({detailsObj}) => {
    return(
        <ListItem alignItems="flex-start">

        <ListItemText
          primary={`title: ${detailsObj.event.title}   |   orgenizer: ${detailsObj.event.category}   |   location: ${detailsObj.event.location}`}
          secondary={
            <React.Fragment>
              
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {`description: ${detailsObj.event.description}  `}
              </Typography>
              {``}
            </React.Fragment>
          }
        />

        <ListItemText
          primary={`order id: ${detailsObj._id}   |   ticket name: ${detailsObj.ticket.name}   |   ticket price: ${detailsObj.ticket.price}   |   ticket quantity: ${detailsObj.ticket.quantity}`}
          secondary={
            <React.Fragment>        
              {`purchase date: ${detailsObj.expires_at} | start date: ${new Date(detailsObj.event.start_date).toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'})} 
              | end date: ${new Date(detailsObj.event.end_date).toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'})}`}
            </React.Fragment>
          }
        />


    </ListItem>
      
    )
}

export default Comment;

