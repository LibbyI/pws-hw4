import { Container, FormLabel, TextField } from "@mui/material";
import { useState } from "react";
import { Form } from "react-router-dom";
import { AsyncButton } from "../common/async-button";
import { AxiosError } from "axios";
import { refundOrder } from "../common/requests";

export const RefundPage: React.FC = () => {
    const [orderId, setOrderId] = useState('');

    async function handleRefund(): Promise<void> {
        try {
            await refundOrder(orderId);
            alert("Refund successful!");
            setOrderId('');            
            
        } catch (error) {
            if (error instanceof AxiosError){
                switch (error.response?.status) {
                    case 400:
                        alert("Event date passed. Cannot refund!");
                        break;
                    case 404:
                        alert("Order not found!");
                        break;
                    default:
                        console.log(JSON.stringify(error));
                        alert("something went wrong, please try again later.");
                        break;
                }
            }
        }
    }

    return (
        <Container>
            <h1>Refund</h1>
            <FormLabel> Order ID </FormLabel>
            <TextField placeholder='Order ID' required = {true} onChange={(e)=> setOrderId(e.target.value)}></TextField>
            <AsyncButton onClick={handleRefund}>Refund</AsyncButton>
        </Container>
    );
    }