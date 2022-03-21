import React, { useState, useCallback, useMemo } from 'react'
import { Box, Stack } from '@mui/material'
import { ForecastProps } from '../../logic/generateForecast'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  makeWeekConfigByRepeating,
} from '../../logic/generateForecast/forecastHelpers'
import NumberInput, { NumberInputProps, NumberState } from './NumberInput'

interface ControlPanelProps {
  onUpdateChart: (forecastProps: ForecastProps) => void
}

const ControlPanel = ({ onUpdateChart: onUpdate }: ControlPanelProps): JSX.Element => {
  const forecastLengthState: NumberState = useState<number>(180)
  const numberOfCardsState: NumberState = useState<number>(1000)
  const newPerDayState: NumberState = useState<number>(20)
  const maxReviewsState: NumberState = useState<number>(200)

  const startingSummary = useMemo(
    () => defaultStartingSummary({ deckSize: numberOfCardsState[0] }),
    [numberOfCardsState]
  )
  const weekConfig = useMemo(
    () =>
      makeWeekConfigByRepeating({
        newCards: newPerDayState[0],
        maxReviews: maxReviewsState[0],
      }),
    [newPerDayState, maxReviewsState]
  )

  const onSubmit = useCallback(() => {
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
      onSubmit: onSubmit,
    },
    {
      label: '# of cards',
      numberState: numberOfCardsState,
      maxValue: 100_000,
      onSubmit: onSubmit,
    },
    {
      label: 'New per day',
      numberState: newPerDayState,
      maxValue: 200,
      onSubmit: onSubmit,
    },
    {
      label: 'Max reviews per day',
      numberState: maxReviewsState,
      maxValue: 1000,
      onSubmit: onSubmit,
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
    </Box>
  )
}

export default ControlPanel
