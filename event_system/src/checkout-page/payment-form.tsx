import { Container,FormControl, FormLabel } from '@mui/material';
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AsyncButton } from '../common/async-button';
import { useNavigate } from 'react-router-dom';
import { payOnOrder } from '../common/requests';
import { IOrder, paymentDetails } from '../../../src/models/orders';

export interface PaymentFormProps   {
    order: IOrder;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({order}) => {
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryError, setExpiryError] = useState(false);
    const [cvvError, setCvvError] = useState(false);
    const [cardNumberError, setCardNumberError] = useState(false);

    const navigate = useNavigate();

    
    function validateFields() {
        //TODO: validate fields
        return true;
    }
    async function handlePay(): Promise<void> {
        if (validateFields()){
            const paymentDetails: paymentDetails = {
                holder: name,
                cc: cardNumber,
                exp: expiry,
                cvv: cvv,
                charge: order.ticket.price * order.ticket.quantity
            }
                await payOnOrder(order, paymentDetails);
                navigate(0);
                           
        }
        else{
            return;
        }
    }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column',alignItems:'center' }}>
        <FormLabel> Name </FormLabel>
        <TextField placeholder='Name' required = {true}></TextField>
        <FormLabel> Card Number</FormLabel>
        {/* <Container sx={{ display: 'flex', flexDirection: 'row',alignItems:'center' }}>
        {Array.from(Array(4),() => (
            <TextField  
            placeholder='0000' 
            required={true}
            error={cardNumberError}
            color={cardNumberColor as "primary" | "error" | "secondary" | "info" | "success" | "warning"} 
            ></TextField>
        ))}
        </Container> */}
        <TextField type='number' placeholder='Card Number'></TextField>
        <FormLabel> Expiry Date</FormLabel>
        <TextField  type='month' ></TextField>
        <FormLabel> CVV</FormLabel>
        <TextField placeholder='CVV'></TextField>
        <AsyncButton onClick={handlePay}>Pay!</AsyncButton>    
    </Container>
  

  );
}


