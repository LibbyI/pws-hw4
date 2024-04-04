import React, { useEffect, useState } from "react";
import AlignItemsList from '../comments/comments.tsx';

import { permissionValidTypes } from "../../../backend/src/models/user.js";
import { useParams } from 'react-router-dom';
import { IEvent, Ticket } from "../../../backend/src/models/event.ts";
import { TicketCardProps } from "./ticket-card.tsx";
import { getEventById } from "../common/requests.ts";
import EventDetails from "./event-details.tsx";
import { Container, Divider } from "@mui/material";
import {TicketsGrid} from "./tickets-grid.tsx";
import { getCookies, isBackoffice } from "../common/utils.ts";
import { CommentsCountBox } from "../comments/comments-count.tsx";
import { EditEventDateForm } from "./edit-event-date-form.tsx";



  

export const EventPage: React.FC = () => {

//********************States**************************/ 
const [event,setEvent] = useState<IEvent>();
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

//********************Hooks**************************/
const userId = getCookies("userId");
const permissionType = getCookies("permissionType");
const { eventId } = useParams();
if(!eventId || !userId || !permissionType || !(Object.values(permissionValidTypes) as string[]).includes(permissionType)){
    return <h1>Invalid URL</h1>
}//TODO: handle error



//********************UseEffect**************************/

useEffect(() => {
    getEventById(eventId).then((response) => {
    setEvent(response?.data as IEvent);
    }).then(() => {setLoading(false);}).catch((error) => {setError(error)});
},[]);

//********************Functions**************************/

const backoffice: boolean = isBackoffice(permissionType as permissionValidTypes);


//********************Render**************************/

    if (loading){
        return <h1>Loading...</h1>
    }//TODO: add loader

    if (error || event === undefined) {
        return <h1>Error: {error}</h1>
    }//TODO: add error page

    return (
        <Container maxWidth={false}>
            <Divider>Event Details</Divider>
            <EventDetails {...event}></EventDetails>
            <Divider> {backoffice ? "Categories" : "Buy Tickets"}</Divider>
            <TicketsGrid tickets={event.tickets.map((t: Ticket): TicketCardProps => { return { ticket: t, eventId: eventId, userId: userId, permissionType: permissionType as permissionValidTypes } })}></TicketsGrid>
            {backoffice? (<CommentsCountBox eventId={eventId}></CommentsCountBox>) : <AlignItemsList eventId={eventId}></AlignItemsList>}
            {backoffice ?
            <>
            <Divider> Edit Event Date</Divider>
            <EditEventDateForm originalStartDate={new Date(event.start_date)} originalEndDate={new Date(event.end_date)} eventId={eventId}></EditEventDateForm>
            </> : <></>}
        </Container>
);}
