
import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';


import {IEvent} from '../../../src/models/event';
import { EventCard } from './eventCard';




export default function EventsGrid(props: {events: Array<IEvent>}) {

    return (
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {Array.from(props.events,(event,index) => (
            <Grid xs={2} sm={4} md={4} key={index}>
                <EventCard {...event}></EventCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }