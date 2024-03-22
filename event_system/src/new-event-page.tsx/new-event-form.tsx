import React, { useState } from "react";
import { IEvent, Ticket } from "../../../backend/src/models/event";
import { Button, Card, Container, FormLabel, List, ListItem, TextField, Typography } from "@mui/material";
import { Form } from "react-router-dom";
import { addNewEvent } from "../common/requests";
import { Axios, AxiosError } from "axios";
import { ReactNode } from "react"; // Add this import
import { AsyncButton } from "../common/async-button";
import { NewTicketForm } from "./new-ticket-form";
import { ObjectId } from "mongoose";
import { TicketsGrid } from "../event-page/tickets-grid";

export const NewEventForm: React.FC = (): ReactNode => {
    const [event, setEvent] = useState<IEvent>({} as IEvent);

    const handleSave = async () => {
        
        try {
            await addNewEvent(event);
            
        } catch (error ) {
            if (error instanceof AxiosError){
                alert(error.message)
            }
            else{
                alert("Failed to add new event")
        }
    }}



    function handleAddTicket(ticket:  Ticket): void {
        if (event.tickets){
            
            setEvent({...event, tickets: [...event.tickets, ticket] as Array<Ticket>});
        }
        else{
            setEvent({...event, tickets: [ticket]});
        }
    }

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormLabel>Event Name</FormLabel>
            <TextField placeholder='Event Name' required={true} onChange={(e) => setEvent({...event, title: e.target.value})}></TextField>
            <FormLabel>Event Description</FormLabel>
            <TextField placeholder='Event Description' required={true} onChange={(e) => setEvent({...event, description: e.target.value})}></TextField>
            <FormLabel>Organizer</FormLabel>
            <TextField placeholder='Orgenizer' required={true} onChange={(e) => setEvent({...event, organizer: e.target.value})}></TextField>
            <FormLabel>Start Date</FormLabel>
            <TextField type='date' required={true} onChange={(e) => setEvent({...event, start_date: new Date(e.target.value)})}></TextField>
            <FormLabel>End Date</FormLabel>
            <TextField type='date' required={true} onChange={(e) => setEvent({...event, end_date: new Date(e.target.value)})}></TextField>
            <FormLabel>Event Location</FormLabel>
            <TextField placeholder='Event Location' required={true} onChange={(e) => setEvent({...event, location: e.target.value})}></TextField>
            <FormLabel>Event Image</FormLabel>
            <TextField type='url' placeholder='Image URL' required={false} onChange={(e) => setEvent({...event, image: e.target.value})}></TextField>
            <NewTicketForm onSubmit={handleAddTicket}/>
            <TicketList tickets={event.tickets} deleteTicket={(idx) => setEvent({...event, tickets: event.tickets?.filter((_,index) => index !== idx)})}/>
            <AsyncButton onClick={handleSave}>Save</AsyncButton>

        </Container>
    );
};


const TicketList: React.FC<{tickets: Ticket[],deleteTicket: (idx:number) => void }> = ({tickets, deleteTicket}) => {
    const TicketData: React.FC<{ticket: Ticket, idx: number}> = ({ticket, idx}) => {
        return(
            <Card >
                <Typography> Name: {ticket.name}</Typography>
                <Typography> Price: {ticket.price}</Typography>
                <Typography> Quantity: {ticket.quantity}</Typography>
                <Button onClick={()=>deleteTicket(idx)}>Delete</Button>
            </Card>
        )};
        return(
    <List>
    {tickets ? Array.from(tickets, (ticket,index)=><ListItem key={index}><TicketData ticket={ticket} idx={index}></TicketData></ListItem>) : <></>}
    </List>)
}

