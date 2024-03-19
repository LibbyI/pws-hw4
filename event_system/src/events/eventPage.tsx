import event, { IEvent } from "../../../src/models/event.ts";
import { EventCard } from "./eventCard.ts"; 

import React from "react";
import EventsGrid from "../catalog/eventsGrid.tsx"
import ButtonAppBar from '../header/header.tsx';
import AlignItemsList from '../comments/comments.tsx';

import { useNavigate } from 'react-router-dom';
import { scrabedIUser } from "../../../src/models/user.js";
import { useParams } from 'react-router-dom';


interface Props{
    logout: () => void;
    getUser: () => scrabedIUser | null;

  };

export const EventPage: React.FC<Props> = ({logout, getUser}) => {
    const { id } = useParams();
    const eventId = id ? id : "";
// export const EventPage = () =>{
    const navigate = useNavigate();
    const goBack = () =>{
        navigate(-1);
    }
    const logoutandgotologin = () =>{
        logout();
        navigate('/signin')
    }

    return (
        <>
        <ButtonAppBar goback={goBack} logout={logoutandgotologin}  getUser={getUser}></ButtonAppBar>
        <AlignItemsList eventId={eventId} getUser={getUser}></AlignItemsList>
        </>
    )
}

