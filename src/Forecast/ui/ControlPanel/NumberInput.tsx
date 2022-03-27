import { useState } from 'react'
import { Input, InputBaseProps, TextField } from '@mui/material'

export interface NumberInputProps {
  value: number
  submitValue: (value: number) => void
  maxValue?: number
  label?: string
}

const NumberInput = ({ label, maxValue, value: initialValue, submitValue }: NumberInputProps) => {
  const [inputValue, setInputValue] = useState<number | undefined>(initialValue)

  const minValue = 0

  const onTextChange: InputBaseProps['onChange'] = event => {
    if (event.target.value === '') {
      setInputValue(undefined)
      return
    }
    const parsedValue = Number(event.target.value)
    const value = isNaN(parsedValue) ? initialValue : parsedValue
    setInputValue(value)
  }

  const onKeyPress: InputBaseProps['onKeyPress'] = event => {
    if (event.key === 'Enter') {
      submitIfValid()
    }
  }

  const submitIfValid = () => {
    if (inputValue !== undefined) {
      //TODO: validate the value and show helper text if needed
      submitValue(inputValue)
    } else {
      setInputValue(initialValue)
    }
  }

  if (label) {
    return (
      <TextField
        label={label}
        value={inputValue}
        onChange={onTextChange}
        onKeyPress={onKeyPress}
        onBlur={submitIfValid}
        style={{
          width: '150px',
        }}
        inputProps={{
          type: 'number',
          variant: 'standard',
          min: minValue,
          max: maxValue,
        }}
      />
    )
  } else {
    return (
      <Input
        value={inputValue}
        onChange={onTextChange}
        onKeyPress={onKeyPress}
        onBlur={submitIfValid}
        style={{
          width: '50px',
        }}
      />
    )
  }
}

export default NumberInput
