import { IEvent } from "../../../backend/src/models/event";
// import { EventCard } from "./eventCard"; 

import React, { useEffect, useState } from "react";
import EventsGrid from "./eventsGrid";
import { getEvents } from "../common/requests.ts";
// import { json } from "stream/consumers";
// import { set } from "mongoose";
import { permissionValidTypes } from "../../../backend/src/models/user.js";
import { getCookies, isBackoffice } from "../common/utils.ts";





export const CatalogPage: React.FC = () =>{


const userId = getCookies("userId");
const permissionType = getCookies("permissionType");
if(!userId || !permissionType || !(Object.values(permissionValidTypes) as string[]).includes(permissionType)){
    return <h1>Invalid URL</h1>
}//TODO: handle error

    
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
        <EventsGrid {... {events : [...events]}}></EventsGrid>
        </>
    )
}