import { useEffect, useState } from "react";
import { IOrder } from "../../../src/models/orders";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, getOrderById } from "../common/requests";
import { IEvent } from "../../../src/models/event";
import { OrderSummary } from "./order-summary";
import { PaymentForm } from "./payment-form";
import { Container } from "@mui/material";

export const CheckoutPage: React.FC = () => {


//********************States**************************/ 
const [order,setOrder] = useState<IOrder>();
const [event, setEvent] = useState<IEvent>();
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

//********************Hooks**************************/
const { orderId } = useParams();
if(!orderId){
    return <h1>Invalid URL</h1>
}//TODO: handle error

const navigate = useNavigate();

//********************UseEffect**************************/
useEffect(() => {
    getOrderById(orderId).then((response) => {
    const responseOrder = response.data as IOrder;
    setOrder(responseOrder);
    getEventById(responseOrder.event_id).then((response) => {
        setEvent(response.data as IEvent);
    })
    }).then(() => {setLoading(false);}).catch((error) => {setError(error)});   }, []);


//********************Render**************************/

if (loading){
    return <h1>Loading...</h1>
}//TODO: add loader

if (error|| order === undefined || event === undefined){
    return <h1>Error: {error}</h1>
}//TODO: add error page

return(
    <Container>
        <OrderSummary ticket={order.ticket} eventName={event.title}/>
        <PaymentForm/>
    </Container>

)
}