import {IEvent} from '../../../backend/src/models/event';
import * as React from 'react';
// import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
// import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CardActionArea } from '@mui/material';
// import { Button, CardActionArea } from '@mui/material';

import { useNavigate } from 'react-router-dom';

  

  
  

  export function EventCard(event: IEvent) {
    const navigate = useNavigate();
    const [expanded] = React.useState(false);

    

    return (
        <Card sx={{ maxWidth: 345 ,display: 'flex', flexDirection:'column'}} className='card' key={event._id}>
          <CardActionArea onClick={() => navigate(`../event/${event._id}`, { relative: "path" })}>
          <CardHeader
            title = {event.title}
            subheader= {event.category}            
          />
        <CardMedia
            component="img"
            height="194"
            image={event.image}
            alt={event._id}
          />
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography variant="body2" color="text.secondary">
                {`From ${Math.min(...Array.from(event.tickets,(t) => t.price))} $`}           
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {`${event.tickets.reduce((acc, t) => acc + t.quantity, 0)} tickets left`}
            </Typography>          
          </CardContent>
          </CardActionArea>
          <CardActions disableSpacing>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>
                {event.description}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      );
    }



