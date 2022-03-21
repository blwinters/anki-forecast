import React, { useState, useMemo, useEffect } from 'react'
import { Box, Stack } from '@mui/material'
import { ForecastProps } from '../../logic/generateForecast'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  makeWeekConfigByRepeating,
} from '../../logic/generateForecast/forecastHelpers'
import NumberInput, { NumberInputProps } from './NumberInput'

interface ControlPanelProps {
  onUpdateChart: (forecastProps: ForecastProps) => void
}

const ControlPanel = ({ onUpdateChart: onUpdate }: ControlPanelProps): JSX.Element => {
  const [forecastLength, setForecastLength] = useState<number>(180)
  const [numberOfCards, setNumberOfCards] = useState<number>(1000)
  const [newPerDay, setNewPerDay] = useState<number>(20)
  const [maxReviews, setMaxReviews] = useState<number>(200)

  const startingSummary = useMemo(
    () => defaultStartingSummary({ deckSize: numberOfCards }),
    [numberOfCards]
  )
  const weekConfig = useMemo(
    () =>
      makeWeekConfigByRepeating({
        newCards: newPerDay,
        maxReviews,
      }),
    [newPerDay, maxReviews]
  )

  useEffect(() => {
    onUpdate({
      startingSummary,
      forecastLength,
      ankiConfig: defaultAnkiConfig,
      weekConfig: weekConfig,
    })
  }, [onUpdate, startingSummary, forecastLength, weekConfig])

  const numberInputs: NumberInputProps[] = [
    {
      label: '# of days',
      value: forecastLength,
      submitValue: setForecastLength,
      maxValue: 730,
    },
    {
      label: '# of cards',
      value: numberOfCards,
      submitValue: setNumberOfCards,
      maxValue: 100_000,
    },
    {
      label: 'New per day',
      value: newPerDay,
      submitValue: setNewPerDay,
      maxValue: 200,
    },
    {
      label: 'Max reviews per day',
      value: maxReviews,
      submitValue: setMaxReviews,
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
    </Box>
  )
}

export default ControlPanel
