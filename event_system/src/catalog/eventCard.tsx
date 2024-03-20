import {IEvent} from '../../../src/models/event';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }
  
  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));
  
  

  export function EventCard(event: IEvent) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345 ,display: 'flex'}} className='card' key={event._id}>
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
                {new Date(event.start_date).toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'})}           
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {event.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {event.organizer}
            </Typography>            
          </CardContent>
          </CardActionArea>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
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



