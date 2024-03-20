import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react"

interface Props{
  value: number;
  setValue: (v: number) => void;
  max?: number;
  min?: number;
}


export const QuantityInput: React.FC<Props> = ({value, setValue, max = 0 , min = 0})=>{

  return (
    <>
    <NumberInput 
      size='lg' 
      maxW={200}
      onChange={(_,v: number) => setValue(v)}
      value={value}
      max={max}
      min={min}
    >
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper  />
      <NumberDecrementStepper />
    </NumberInputStepper>
    </NumberInput>
    </>
  )
}