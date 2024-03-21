import { Container,FormControl, FormLabel } from '@mui/material';
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AsyncButton } from '../common/async-button';
import { useNavigate } from 'react-router-dom';
import { payOnOrder, updateEventDate } from '../common/requests';
interface pros {
    originalStartDate: Date;
    originalEndDate: Date;
    eventId: string;
}

export const EditEventDateForm: React.FC<pros> = ({originalStartDate, originalEndDate, eventId}) => {
    
    originalStartDate = new Date(originalStartDate);
    originalEndDate = new Date(originalEndDate);
    const [startDate, setStartDate] = useState(originalStartDate);
    const [endDate, setEndDate] = useState(originalEndDate);
    const [startDateError, setStartDateError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);

    const Navigate = useNavigate();

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (new Date(e.target.value) < originalStartDate){
            setStartDate(originalStartDate);
            e.target.value = originalStartDate.toISOString().split('T')[0];
            setStartDateError(true);

        }
        else{
            setStartDate(new Date(e.target.value));
            setStartDateError(false);
        }
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (new Date(e.target.value) < startDate){
            setEndDate(startDate);
            e.target.value = startDate.toISOString().split('T')[0];
            setEndDateError(true);
        }
        else{
            setEndDate(new Date(e.target.value));
            setEndDateError(false);
        }
    }

    const handleSave = async () => {
        if (await updateEventDate(eventId, startDate, endDate) === null){
           alert("Event date updated failed!");
        }
        else{
            alert("Event date updated successfully!");
            Navigate(0);
        }
    }

      

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FormLabel>Start Date</FormLabel>
        <TextField type='date' required={true} InputProps={{inputProps: {min:originalStartDate}}} onChange={handleStartDateChange} error= {startDateError}></TextField>
        <FormLabel>End Date</FormLabel>
        <TextField type='date' required={true} onChange={handleEndDateChange} error={endDateError}></TextField>
        <AsyncButton onClick={handleSave}>Save</AsyncButton>
        </Container>
    )
}

