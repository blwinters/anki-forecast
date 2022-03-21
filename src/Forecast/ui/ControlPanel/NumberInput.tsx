import React, { useState } from 'react'
import { OutlinedInputProps, TextField } from '@mui/material'

export interface NumberInputProps {
  label: string
  value: number
  submitValue: (value: number) => void
  maxValue: number
}

const NumberInput = ({ label, maxValue, value: initialValue, submitValue }: NumberInputProps) => {
  const [inputValue, setInputValue] = useState<number>(initialValue)

  const minValue = 0

  const onTextChange: OutlinedInputProps['onChange'] = event => {
    setInputValue(parseInt(event.target.value))
  }

  const submitIfValid = () => {
    //TODO: validate the value and show helper text if needed
    submitValue(inputValue)
  }

  return (
    <TextField
      value={inputValue}
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
