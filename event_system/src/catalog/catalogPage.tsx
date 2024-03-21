import event, { IEvent } from "../../../src/models/event";
import { EventCard } from "./eventCard"; 

import React, { useEffect, useState } from "react";
import EventsGrid from "./eventsGrid";
import { getEvents } from "../common/requests.ts";
import { json } from "stream/consumers";
import { set } from "mongoose";
import { permissionValidTypes, scrabedIUser } from "../../../src/models/user.js";
import { useNavigate, useParams } from 'react-router-dom';
import ButtonAppBar from '../header/header.tsx';
import { isBackoffice } from "../common/utils.ts";
import { not } from "joi";


interface Props{
    logout: () => void;
    getUser: () => scrabedIUser | null;

  };


export const CatalogPage: React.FC<Props> = ({ logout, getUser}) =>{
const navigate = useNavigate();
const goBack = () =>{
    navigate(-1);
}

const { userId, permissionType } = useParams();
if(!userId || !permissionType || !(Object.values(permissionValidTypes) as string[]).includes(permissionType)){
    return <h1>Invalid URL</h1>
}//TODO: handle error


const logoutandgotologin = () =>{
    logout();
    navigate(`/signin`)
}

    
const [events,setEvents] = useState<IEvent[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    getEvents(!isBackoffice(permissionType as permissionValidTypes)).then((response) => {
        if (response?.status === 200){
            setEvents(response.data as IEvent[]);
        }
        else{
            setError(error);
        }
    }).then(() => {setLoading(false);});
},[]);


    if (loading){
        return <h1>Loading...</h1>
    }
    if (error){
        return <h1>Error: {error}</h1>
    }
    console.log(events);
    return (
        <>
        <ButtonAppBar goback={goBack} logout={logoutandgotologin} getUser={getUser}></ButtonAppBar>
        <EventsGrid {... {events : [...events]}}></EventsGrid>
        </>
    )
}


// const exampleEvents: Array<IEvent> = (Array.from(Array(10),(_, i) => ({
//     _id: i.toString(),
//     title: "title",
//     category: "category",
//     description: "description",
//     organizer: "organizer",
//     start_date: new Date(2024,8,8),
//     end_date: new Date(2024, 9,9),
//     location: "location",
//     tickets: [{ name: "ticket", quantity: 1, price: 1 }],
//     image: "data:image/jpeg;base64,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",
// })));