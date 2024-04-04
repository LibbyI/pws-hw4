import React, { useState } from "react";
import { IEvent, Ticket } from "../../../backend/src/models/event";
import { List, Button, Container, FormLabel, ListItem, MenuItem, Paper, Select, TextField, Typography, Divider } from "@mui/material";
import { addNewEvent } from "../common/requests";
import {  AxiosError } from "axios";
import { ReactNode } from "react"; // Add this import
import { AsyncButton } from "../common/async-button";
import { NewTicketForm } from "./new-ticket-form";
import { categoryValidTypes } from "../../../backend/src/models/event";
import { WidthFull } from "@mui/icons-material";


export const NewEventForm: React.FC = (): ReactNode => {
    const [event, setEvent] = useState<IEvent>({start_date: new Date(Date.now())} as IEvent);

    const handleSave = async () => {
        if(!event.title || !event.description || !event.organizer || !event.location || !event.category || !event.start_date || !event.end_date || !event.tickets){
            alert("Please fill all required fields");
            return;
        }
        

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


    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (new Date(e.target.value) < event.start_date){
            console.log(event.start_date);
            setEvent({...event, end_date: event.start_date});
            e.target.value = event.start_date.toISOString().split('T')[0];
            alert("End date cannot be before start date");
        }
        else{
            setEvent({...event, end_date: new Date(e.target.value)});
        }
    }

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', justifyContent:'space-evenly', height:'100%'}}>
        <Container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormLabel>Event Name</FormLabel>
            <TextField placeholder='Event Name' required={true} onChange={(e) => setEvent({...event, title: e.target.value})} error = {event.title === ""}></TextField>
            <FormLabel>Event Description</FormLabel>
            <TextField placeholder='Event Description' required={true} onChange={(e) => setEvent({...event, description: e.target.value}) }error = {event.description === ""}></TextField>
            <FormLabel>Category</FormLabel>
            <CategoryDropDown setCategory={(category) => setEvent({...event, category: category})} category={event.category}></CategoryDropDown>
            <FormLabel>Organizer</FormLabel>
            </Container>
            <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormLabel>Start Date</FormLabel>
            <TextField type='date' required={true} onChange={(e) => setEvent({...event, start_date:new Date( e.target.value)})} defaultValue={Date.now()}></TextField>
            <FormLabel>End Date</FormLabel>
            <TextField type='date' required={true} onChange={handleEndDateChange}></TextField>
            <FormLabel>Event Location</FormLabel>
            <TextField placeholder='Event Location' required={true} onChange={(e) => setEvent({...event, location: e.target.value})}></TextField>
            <FormLabel>Event Image</FormLabel>
            <TextField type='url' placeholder='Image URL (optional)' required={false} onChange={(e) => setEvent({...event, image: e.target.value})}></TextField>

            </Container>
        
        </Container>
        <Divider orientation="horizontal" flexItem ></Divider>
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <NewTicketForm onSubmit={handleAddTicket}/>
            <Divider orientation="horizontal">Tickets</Divider>
            {event.tickets?.length === 0 ? <Typography>No tickets added to this event yet.</Typography> : <TicketList tickets={event.tickets} deleteTicket={(idx) => setEvent({...event, tickets: event.tickets?.filter((_:any,index:any) => index !== idx)})}/>}
            

        </Container>
        <AsyncButton onClick={handleSave} >Save</AsyncButton>
        </Container>

    );
};


const TicketList: React.FC<{tickets: Ticket[],deleteTicket: (idx:number) => void }> = ({tickets, deleteTicket}) => {
    const TicketData: React.FC<{ticket: Ticket, idx: number}> = ({ticket, idx}) => {
        return(
            <Paper sx={{display:'flex' ,flexDirection: "row", p: 1, gap:2 }}>
                <Typography> Name: {ticket.name}</Typography>
                <Typography> Price: {ticket.price}</Typography>
                <Typography> Quantity: {ticket.quantity}</Typography>
                <Button onClick={()=>deleteTicket(idx)}>Delete</Button>
            </Paper>
        )};
        return(
    <List >
    {tickets ? Array.from(tickets, (ticket,index)=><ListItem key={index}><TicketData ticket={ticket} idx={index}></TicketData></ListItem>) : <></>}
    </List>)
}

const CategoryDropDown: React.FC<{ setCategory: (category: string) => void , category: string}> = ({setCategory, category}) => {
    return(
            <Select 
            onChange={(e)=>setCategory(e.target.value)}
            value={category}
            placeholder= "Category">
            {Array.from(categoryValidTypes, (category, index) => (<MenuItem key={index} value={category}>{category}</MenuItem>))}
            </Select>
    )
}

