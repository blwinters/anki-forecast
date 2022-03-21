import React from 'react'
import { OutlinedInputProps, TextField } from '@mui/material'

export type NumberState = [number, (value: number) => void]

export interface NumberInputProps {
  label: string
  numberState: NumberState
  maxValue: number
  onSubmit: () => void
}

const NumberInput = ({ label, maxValue, numberState, onSubmit }: NumberInputProps) => {
  const [value, setValue] = numberState

  const minValue = 0

  const onTextChange: OutlinedInputProps['onChange'] = event => {
    setValue(parseInt(event.target.value))
  }

  const submitIfValid = () => {
    //TODO: validate the value and show helper text if needed
    onSubmit()
  }

  return (
    <TextField
      value={value}
      style={{
        width: '150px',
      }}
      onChange={onTextChange}
      onKeyPress={event => {
        if (event.key === 'Enter') {
          submitIfValid()
        }
      }}
      label={label}
      onBlur={submitIfValid}
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
