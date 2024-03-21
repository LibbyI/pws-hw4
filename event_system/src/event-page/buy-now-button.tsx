import React from "react";
import { IOrder } from "../../../backend/src/models/orders";
import { placeNewOrder } from "../common/requests";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";

import LoadingButton from '@mui/lab/LoadingButton';


export const BuyNowButton: React.FC<IOrder> = (order) => {

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();


  const handleClick = async () => {
    setLoading(true);
    placeNewOrder(order).then((response)=> navigate(`../../checkout/${response.data._id}`, { relative: "path" })).catch(() => /*TODO: popwindowWith error*/ navigate(0));
  };
  return (
    <LoadingButton
    onClick={handleClick}
    loading={loading}
    variant="contained"
    disabled = {order.ticket.quantity === 0}
  >
    <span>Buy Now!</span>
  </LoadingButton>
  );
}
