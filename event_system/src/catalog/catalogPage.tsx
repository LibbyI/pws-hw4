import { IEvent } from "../../../src/models/event";
import { EventCard } from "./eventCard"; 

import React from "react";


export const CatalogPage = () =>{

    return (
        <EventCard {...exampleEvent}></EventCard>
    )
}


const exampleEvent: IEvent = {
    _id: "1",
    title: "title",
    category: "category",
    description: "description",
    organizer: "organizer",
    start_date: new Date(2024,8,8),
    end_date: new Date(2024, 9,9),
    location: "location",
    tickets: [{ name: "ticket", quantity: 1, price: 1 }],
    image: "image",
};
