
import { OrderSummary , OrderSummaryProps} from './order-summary'; // Replace '../path/to/OrderSummaryProps' with the actual path to the OrderSummaryProps file
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface SuccessPageProps {
    orderSummary: OrderSummaryProps;
    orderId: string;

}

export const SuccessPage: React.FC<SuccessPageProps> = ({orderSummary, orderId}) => {
const navigate = useNavigate();

    return (
        <Container maxWidth= {"sm"}>
        <Typography variant='h1' component='div'>
            Congratulation! Enjoy!
        </Typography>
        <Typography variant='h2' component='div'>
            Order Id: {orderId};
        </Typography>
        <OrderSummary {...orderSummary}></OrderSummary>
        <button onClick={() => navigate('../../catalog',{relative: "path"} )} >Go back to catalog</button>
        </Container>
    );
}
