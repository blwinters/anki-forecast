import React from 'react'
import { OutlinedInputProps, TextField } from '@mui/material'

export type NumberState = [number, (value: number) => void]

export interface NumberInputProps {
  label: string
  numberState: NumberState
  maxValue: number
}

const NumberInput = ({ label, maxValue, numberState }: NumberInputProps) => {
  const [value, setValue] = numberState

  const minValue = 0

  const onTextChange: OutlinedInputProps['onChange'] = event => {
    setValue(parseInt(event.target.value))
  }

  const onBlur = () => {
    //TODO: validate the value and show helper text if needed
  }

  return (
    <TextField
      value={value}
      style={{
        width: '150px',
      }}
      onChange={onTextChange}
      label={label}
      onBlur={onBlur}
      inputProps={{
        type: 'number',
        variant: 'standard',
        min: minValue,
        max: maxValue,
      }}
    />
  )
}

export default NumberInput
