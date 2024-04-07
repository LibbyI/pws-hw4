
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { IEvent } from '../../../backend/src/models/event';
import { Divider } from '@mui/material';

export default function EventDetails(event: IEvent) {

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column'}}>
        <Typography variant='h2' component='div'>
            {event.title}
        </Typography>
        <Typography variant='h4' component='div'>
            {event.category}
        </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse',alignItems:'center' }}>
      <Box sx={{ display: 'flex' , flexDirection: 'column',  p:5, flex:1}}>
        <Typography variant='h4' component='div' >
           Description:
        </Typography>
        <Typography variant='body1' component='div'>
            {event.description}
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ flexDirection: 'column', p:5, flex:1 }}>
        <Typography variant='h6' component='div' >
            Start Date: {new Date(event.start_date).toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'})}
        </Typography>
        <Typography variant='h6' component='div'>
            End Date: {new Date(event.end_date).toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'})}
        </Typography>
        <Typography variant='h6' component='div'>
            Location: {event.location}
        </Typography>
        <Typography variant='h6' component='div'>
            Organizer: {event.organizer}
        </Typography>
      </Box>
            <Divider orientation="vertical" flexItem />
      {event.image === "" ? <></> : 
      <Box sx={{ display: 'flex' , flexDirection: 'column',  p:5, flex: 1 }}>
        <CardMedia 
        component="img"
        image= {event.image}
      />
      </Box>
    }
      </Box>

    </Card>
  );
}
