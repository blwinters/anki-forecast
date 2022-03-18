import React, { useState, useCallback, useMemo } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { ForecastProps } from '../../logic/generateForecast'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  makeWeekConfigByRepeating,
} from '../../logic/generateForecast/forecastHelpers'
import NumberInput, { NumberInputProps, NumberState } from './NumberInput'

interface ControlPanelProps {
  onUpdate: (forecastProps: ForecastProps) => void
}

const ControlPanel = ({ onUpdate }: ControlPanelProps): JSX.Element => {
  const forecastLengthState: NumberState = useState<number>(180)
  const newPerDayState: NumberState = useState<number>(20)
  const maxReviewsState: NumberState = useState<number>(200)

  const startingSummary = useMemo(() => defaultStartingSummary({ deckSize: 1000 }), [])
  const weekConfig = useMemo(
    () =>
      makeWeekConfigByRepeating({
        newCards: newPerDayState[0],
        maxReviews: maxReviewsState[0],
      }),
    [newPerDayState, maxReviewsState]
  )

  const onClickUpdate = useCallback(() => {
    onUpdate({
      startingSummary,
      forecastLength: forecastLengthState[0],
      ankiConfig: defaultAnkiConfig,
      weekConfig: weekConfig,
    })
  }, [onUpdate, startingSummary, forecastLengthState, weekConfig])

  const numberInputs: NumberInputProps[] = [
    {
      label: '# of days',
      numberState: forecastLengthState,
      maxValue: 730,
    },
    {
      label: 'New per day',
      numberState: newPerDayState,
      maxValue: 200,
    },
    {
      label: 'Max reviews per day',
      numberState: maxReviewsState,
      maxValue: 1000,
    },
  ]

  return (
    <Box
      sx={{
        marginLeft: '80px',
        marginTop: '40px',
      }}>
      <Stack direction="row" spacing={5} style={{ marginBottom: '30px' }}>
        {numberInputs.map((props, index) => (
          <NumberInput key={index} {...props} />
        ))}
      </Stack>
      <Button variant="contained" onClick={onClickUpdate}>
        Update
      </Button>
    </Box>
  )
}

export default ControlPanel
