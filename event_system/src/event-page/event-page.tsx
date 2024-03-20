import React, { useEffect, useState } from "react";
import ButtonAppBar from '../header/header.tsx';
import AlignItemsList from '../comments/comments.tsx';

import { useNavigate } from 'react-router-dom';
import { scrabedIUser } from "../../../src/models/user.js";
import { useParams } from 'react-router-dom';
import event, { IEvent, Ticket } from "../../../src/models/event.ts";
import TicketCard from "./ticket-card.tsx";
import { getEventById } from "../requests.ts";
import { EventCard } from "../catalog/eventCard.tsx";
import EventDetails from "./event-details.tsx";
import { Box, Container, CssBaseline } from "@mui/material";
import {TicketsGrid} from "./tickets-grid.tsx";


interface Props{
    logout: () => void;
    getUser: () => scrabedIUser | null;

  };
  

export const EventPage: React.FC<Props> = ({logout, getUser}) => {

//********************States**************************/ 
const [event,setEvent] = useState<IEvent>();
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

//********************Hooks**************************/
const { eventId } = useParams();
if(!eventId){
    return <h1>Invalid EventId</h1>
}//TODO: handle error

const navigate = useNavigate();

//********************UseEffect**************************/

useEffect(() => {
    getEventById(eventId).then((response) => {
    setEvent(response?.data as IEvent);
    }).then(() => {setLoading(false);}).catch((error) => {setError(error)});
},[]);

//********************Functions**************************/
const logoutandgotologin = () =>{
    logout();
    navigate('/signin')
}

const goBack = () =>{
    navigate(-1);
}

//********************Render**************************/

    if (loading){
        return <h1>Loading...</h1>
    }//TODO: add loader

    if (error|| event === undefined){
        return <h1>Error: {error}</h1>
    }//TODO: add error page

    return (
        <Container maxWidth= {false}>
        <ButtonAppBar goback={goBack} logout={logoutandgotologin}  getUser={getUser}></ButtonAppBar>
        <EventDetails {...event}></EventDetails>
        <TicketsGrid tickets = {event.tickets}></TicketsGrid>
        <AlignItemsList eventId={eventId} getUser={getUser}></AlignItemsList>
        </Container>
    )};