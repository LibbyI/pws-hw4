import { useEffect, useState } from "react";
import { IOrder, orderStatus } from "../../../backend/src/models/orders";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, getOrderById } from "../common/requests";
import { IEvent } from "../../../backend/src/models/event";
import { OrderSummary } from "./order-summary";
import { PaymentForm } from "./payment-form";
import { Container, Card, CardActionArea, Button } from "@mui/material";
import { SuccessPage } from "./succsess-page";

export const CheckoutPage: React.FC = () => {


//********************States**************************/ 
const [order,setOrder] = useState<IOrder>();
const [event, setEvent] = useState<IEvent>();
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [retry, setRetry] = useState(0);

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
}

 else if (error ||  order === undefined || event === undefined) {
    return (
        <Card>
            <CardActionArea onClick={() => navigate(-1)}>
                <h1>Your order is expired, click to try place new order {error}</h1>
            </CardActionArea>
        </Card>
    )
}



if (order.status === orderStatus.completed) {
    return <SuccessPage orderSummary={{ ticket: order.ticket, eventName: event.title }} orderId={orderId} />
}

if (retry > 1 ){
    return (
        <Card>
            <CardActionArea onClick={() => navigate(-1)}>
                <h1>You ran out of payment retries. Please try to place a new oreder from enet page</h1>
                <Button onClick={() => navigate(-1)}>To event page</Button>
            </CardActionArea>
        </Card>
    )

}
return(
    <Container>
        <OrderSummary ticket={order.ticket} eventName={event.title}/>
        <PaymentForm order= {order}/>
    </Container>

)
}