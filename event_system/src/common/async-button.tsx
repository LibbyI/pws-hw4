import React from "react";
import { IOrder } from "../../../src/models/orders";
import { useNavigate } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';

export interface AsyncButtonProps   {
    onClick: () => Promise<void>;
    disabled? : boolean;
    children?: React.ReactNode;
}

export const AsyncButton: React.FC<AsyncButtonProps> = ({onClick, disabled = false, children}) =>{

const [loading, setLoading] = React.useState(false);


const handleClick = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
};


  return (
    <LoadingButton
      onClick={handleClick}
      loading={loading}
      variant="contained"
      disabled={disabled}
    >
      {children}
    </LoadingButton>
  );
}
