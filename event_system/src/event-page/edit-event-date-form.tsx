import { Container,FormControl, FormLabel } from '@mui/material';
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AsyncButton } from '../common/async-button';
import { useNavigate } from 'react-router-dom';
import { payOnOrder } from '../common/requests';
interface pros {
    originalStartDate: Date;
    originalEndDate: Date;
    eventId: string;
}

export const EditEventDateForm: React.FC<pros> = ({originalStartDate, originalEndDate, eventId}) => {
    const [startDate, setStartDate] = useState(new Date(originalStartDate));
    const [endDate, setEndDate] = useState(new Date(originalEndDate));
    const [earlyStartDateError, setEarlyStartDateError] = useState(false);

    // const useStyles = makeStyles({
    //     input: {
    //       "&:valid": {
    //         backgroundColor: "yellow"
    //       },
    //       "&:invalid": {
    //         backgroundColor: "red"
    //       }
    //     }
    //   });
      

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FormLabel>Start Date</FormLabel>
        <TextField type='date' required={true} InputProps={{inputProps: {min:originalStartDate}}}></TextField>
        <FormLabel>End Date</FormLabel>
        <TextField type='date' required={true} ></TextField>
        </Container>
    )
}