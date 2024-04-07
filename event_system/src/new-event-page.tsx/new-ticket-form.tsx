import { Button, Container, FormLabel, TextField } from "@mui/material";
import { useState } from "react";
import { QuantityInput } from "../event-page/quantity-input";
import { Ticket } from "../../../backend/src/models/event";

export const NewTicketForm: React.FC<{onSubmit: (ticket:Ticket) => void}> = ({onSubmit}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    function submitHandler(): void {
        if (name === '' || price === 0 || quantity === 0){
            alert("Please fill all fields")
            return;
        }
        onSubmit({name, price, quantity} as Ticket);
    }

    return(
        <>
        <Container sx={{display:'flex', alignItems:'self-start'}}>
            <FormLabel> Name </FormLabel>
            <TextField placeholder='Name' required = {true} onChange={(e)=> setName(e.target.value)}></TextField>
            <FormLabel> Price</FormLabel>
            <QuantityInput setValue={setPrice} min={0} max={Infinity}/>
            <FormLabel> Quantity</FormLabel>
            <QuantityInput setValue={setQuantity} min={1} max={Infinity}/>
        </Container>
        <Button onClick={() => submitHandler()}>Add Ticket</Button>
        </>


    )

}