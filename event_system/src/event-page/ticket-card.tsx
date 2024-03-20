import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Ticket } from '../../../src/models/event';
import { QuantityInput } from './quantity-input';
import { Button } from '@mui/material';




export default function TicketCard(ticket: Ticket) {
  const [selectedTicketQuantity, setSelectedTicketQuantity] = React.useState(0);


  return (
    <Card sx={{background: 'grey'}}>
      <CardContent>
        <Typography variant="h5" component="div">
            {ticket.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          price: {ticket.price}$
        </Typography>
        <Typography variant="body2">
            {(ticket.price===0) ? "no ticket left" : `${ticket.quantity} tickets left !`}
        </Typography>
      </CardContent>
      <CardActions  >
        <QuantityInput value={selectedTicketQuantity} setValue={setSelectedTicketQuantity} max={ticket.quantity} min={0} />
        <Button variant="contained" size="large"  onClick= {()=> goToCheckOut({ name : ticket.name, quantity: selectedTicketQuantity, price: ticket.price})}>
                Buy Now!
        </Button>
      </CardActions>
    </Card>
  );
}

function goToCheckOut(ticket: Ticket): void {
  
}