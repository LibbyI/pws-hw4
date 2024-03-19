import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Ticket } from '../../../src/models/event';


export default function TicketCard(ticket: Ticket) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
            {ticket.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          price: {ticket.price}$
        </Typography>
        <Typography variant="body2">
            {(ticket.price===0) ? "no ticket left" : `${ticket.quantity} left!`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}