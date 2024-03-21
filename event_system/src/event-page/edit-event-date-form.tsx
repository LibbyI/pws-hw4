import { Container,FormControl, FormLabel } from '@mui/material';
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AsyncButton } from '../common/async-button';
import { useNavigate } from 'react-router-dom';
import { payOnOrder } from '../common/requests';
import { IOrder, paymentDetails } from '../../../src/models/orders';

interface pros {
    originalStartDate: Date;
    originalEndDate: Date;
    eventId: string;
}

export const EditEventDateForm: React.FC<pros> = ({originalStartDate, originalEndDate, eventId}) => {
    const [startDate, setStartDate] = useState(new Date(originalStartDate));
    const [endDate, setEndDate] = useState(new Date(originalEndDate));
    const [earlyStartDateError, setEarlyStartDateError] = useState(false);


    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FormLabel>Start Date</FormLabel>
        <TextField type='date' required={true} ></TextField>
        <FormLabel>End Date</FormLabel>
        <TextField type='datetime-local' required={true} ></TextField>
        </Container>
    )
}