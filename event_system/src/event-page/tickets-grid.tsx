import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { Ticket } from '../../../src/models/event';
import {TicketCard, TicketCardProps} from './ticket-card';
import { Title } from '@mui/icons-material';
import { Typography } from '@mui/material';

export const TicketsGrid: React.FC<{tickets: Array<TicketCardProps>}> = ({tickets}) => {
    return (
        <Box sx={{ flexGrow: 1 , p: 2}}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {Array.from(tickets,(ticket,index) => (
            <Grid xs={2} sm={4} md={4} key={index} >
                <TicketCard {...ticket} ></TicketCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
}