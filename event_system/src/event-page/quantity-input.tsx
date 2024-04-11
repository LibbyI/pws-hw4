
import { TextField } from "@mui/material";

interface Props{
  setValue: (v: number) => void;
  max?: number;
  min?: number;
}


export const QuantityInput: React.FC<Props> = ({setValue, max = 0 , min = 0})=>{

  function handleChange(): import("react").ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined {
    return (e) => {
      if (e.target.value === ""){
        setValue(0);
      }
      else if (parseInt(e.target.value) > max){
        e.target.value = max.toString();
        setValue(max);
      }
      else if (parseInt(e.target.value) < min){
        e.target.value = min.toString();
        setValue(min);
      }
      else
      setValue(parseInt(e.target.value));
    }

  }

  return ( <TextField type='number' 
  defaultValue={max === 0 ? 0 : 1}
  inputProps = {{ type: 'number', min: min, max: max, inputmode: "numeric" }}
  onChange={handleChange()} />
  )
}