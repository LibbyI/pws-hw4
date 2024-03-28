import { Container, FormLabel } from '@mui/material';
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
import { AsyncButton } from '../common/async-button';
import { useNavigate } from 'react-router-dom';
import { payOnOrder } from '../common/requests';
import { IOrder, paymentDetails } from '../../../backend/src/models/orders';

export interface PaymentFormProps   {
    order: IOrder;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({order}) => {
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [retries, setRetries] = useState(0);

    // const [expiryError, setExpiryError] = useState(false);
    // const [cvvError, setCvvError] = useState(false);
    // const [cardNumberError, setCardNumberError] = useState(false);

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
                exp: expiry.split('-').reverse().join('/'),
                cvv: cvv,
                charge: order.ticket.price * order.ticket.quantity
            }
                console.log(paymentDetails);
                
                if (await payOnOrder(order, paymentDetails) === null){
                    if (retries === 0){
                        alert('Payment failed, please try again');
                        setRetries(retries + 1);
                    }
                    else{
                        alert('You ran out of payment retries, redirecting to event page');
                        navigate(-1);
                    }

                }
                else{
                    navigate(0);
                }
                           
        }
        else{
            return;
        }
    }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column',alignItems:'center' }}>
        <FormLabel> Name </FormLabel>
        <TextField placeholder='Name' required = {true} onChange={(e)=> setName(e.target.value)}></TextField>
        <FormLabel> Card Number</FormLabel>
        <TextField type='number' placeholder='Card Number' onChange={(e) => setCardNumber(e.target.value)}></TextField>
        <FormLabel> Expiry Date</FormLabel>
        <TextField  type='month' onChange={(e)=>setExpiry(e.target.value)}></TextField>
        <FormLabel> CVV</FormLabel>
        <TextField placeholder='CVV' onChange={(e)=> setCvv(e.target.value)}></TextField>
        <AsyncButton onClick={handlePay}>Pay!</AsyncButton>    
    </Container>
  

  );
}


