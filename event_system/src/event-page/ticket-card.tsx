import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Ticket } from '../../../backend/src/models/event';
import { QuantityInput } from './quantity-input';
import { BuyNowButton } from './buy-now-button';
import { permissionValidTypes } from '../../../backend/src/models/user';
import { isBackoffice } from '../common/utils';
//import { BuyNowButton } from './buy-now-button';

export interface TicketCardProps{
    ticket: Ticket;
    eventId: string;
    userId: string;
    permissionType: permissionValidTypes;
}



export const TicketCard: React.FC<TicketCardProps> = ({ticket, eventId, userId, permissionType}) => {
  const [selectedTicketQuantity, setSelectedTicketQuantity] = React.useState(Math.min(1, ticket.quantity));


  return (
    <Card >
      <CardContent>
        <Typography variant="h5" component="div">
            {ticket.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          price: {ticket.price}$
        </Typography>
        <Typography variant="body2">
            {(ticket.quantity===0) ? "No Tickets left" : `${ticket.quantity}${isBackoffice(permissionType)? ` / ${ticket.original_quantity}` : "" } tickets left !`}
        </Typography>
      </CardContent>
      {isBackoffice(permissionType) ? (<></>) :<CardActions  >
        <QuantityInput setValue={setSelectedTicketQuantity} max={ticket.quantity} min={0} />
        <BuyNowButton ticket={{...ticket, quantity: selectedTicketQuantity}} event_id={eventId} user_id={userId} />
      </CardActions> }
    </Card>
  );
}


