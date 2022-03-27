import { useState, useMemo, useEffect, useReducer } from 'react'
import { Stack } from '@mui/material'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  defaultWeekConfig,
  ForecastProps,
} from '../../logic'
import NumberInput, { NumberInputProps } from './NumberInput'
import WeekConfigPanel, { WeekConfigType } from './WeekConfigPanel'
import { weekConfigReducer } from './WeekConfigReducer'
import AnkiConfigPanel from './AnkiConfigPanel'
import { ankiConfigReducer } from './AnkiConfigReducer'
import { layout } from '../styles'

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

  const [ankiConfigState, dispatchAnkiConfigAction] = useReducer(
    ankiConfigReducer,
    defaultAnkiConfig
  )

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
      ankiConfig: ankiConfigState,
      weekConfig,
    })
  }, [onUpdate, startingSummary, forecastLength, ankiConfigState, weekConfig])

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
    <Stack direction="column" spacing={layout.stackSpacing} style={{ marginBottom: '30px' }}>
      {numberInputs.map((props, index) => (
        <NumberInput key={index} {...props} />
      ))}
      <WeekConfigPanel state={weekConfigState} dispatch={dispatchWeekConfigAction} />
      <AnkiConfigPanel state={ankiConfigState} dispatch={dispatchAnkiConfigAction} />
    </Stack>
  )
}

export default ControlPanel
