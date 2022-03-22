import React, { useState, useMemo, useEffect, useReducer } from 'react'
import { Stack } from '@mui/material'
import { ForecastProps } from '../../logic/generateForecast'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  defaultWeekConfig,
} from '../../logic/generateForecast/forecastHelpers'
import NumberInput, { NumberInputProps } from './NumberInput'
import WeekConfigPanel, { WeekConfigType } from './WeekConfigPanel'
import { weekConfigReducer } from './WeekConfigReducer'

interface ControlPanelProps {
  onUpdateChart: (forecastProps: ForecastProps) => void
}

const ControlPanel = ({ onUpdateChart: onUpdate }: ControlPanelProps): JSX.Element => {
  const [forecastLength, setForecastLength] = useState<number>(180)
  const [numberOfCards, setNumberOfCards] = useState<number>(1000)

  const [weekConfigState, dispatchWeekConfigAction] = useReducer(weekConfigReducer, {
    selectedType: WeekConfigType.Basic,
    basic: defaultWeekConfig,
    dayOfWeek: defaultWeekConfig,
  })

  const useBasic = weekConfigState.selectedType === WeekConfigType.Basic
  const weekConfig = useBasic ? weekConfigState.basic : weekConfigState.dayOfWeek

  const startingSummary = useMemo(
    () => defaultStartingSummary({ deckSize: numberOfCards }),
    [numberOfCards]
  )

  useEffect(() => {
    onUpdate({
      startingSummary,
      forecastLength,
      ankiConfig: defaultAnkiConfig,
      weekConfig,
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
  ]

  return (
    <Stack direction="column" spacing={5} style={{ marginBottom: '30px' }}>
      {numberInputs.map((props, index) => (
        <NumberInput key={index} {...props} />
      ))}
      <WeekConfigPanel state={weekConfigState} dispatch={dispatchWeekConfigAction} />
    </Stack>
  )
}

export default ControlPanel
