import { Card, Container, Typography } from "@mui/material";
import { IOrder } from "../../../src/models/orders";
import { Ticket } from "../../../src/models/event";

export interface OrderSummaryProps {
    eventName: string;
    ticket: Ticket;
}
export const OrderSummary: React.FC<OrderSummaryProps> = ({eventName, ticket}) =>
{
    return (
        <Container maxWidth= {"sm"}>
        <Typography variant='h1' component='div'>
              Order Summary:
        </Typography>
        <Card sx={{ display: 'flex', flexDirection: 'column', margin: 5}}>
          <Typography variant='h2' component='div'>
              {eventName}
          </Typography>
            <Typography variant='h3' component='div'>
                {ticket.quantity} X {ticket.name}
            </Typography>
            <Typography variant='h4' component='div'>
                Total: {ticket.price * ticket.quantity}$
            </Typography>
  
      </Card>
        </Container>

    );
  }