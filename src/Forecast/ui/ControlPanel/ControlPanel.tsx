import { useMemo, useEffect, useReducer } from 'react'
import { Stack } from '@mui/material'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  defaultWeekConfig,
  defaultBasicConfig,
  ForecastProps,
} from '../../logic'
import WeekConfigPanel, { WeekConfigType } from './WeekConfigPanel'
import { weekConfigReducer } from './WeekConfigReducer'
import AnkiConfigPanel from './AnkiConfigPanel'
import { ankiConfigReducer } from './AnkiConfigReducer'
import { layout } from '../styles'
import { basicConfigReducer } from './BasicConfigReducer'
import { BasicConfigPanel } from './BasicConfigPanel'

interface ControlPanelProps {
  onUpdateChart: (forecastProps: ForecastProps) => void
}

const ControlPanel = ({ onUpdateChart: onUpdate }: ControlPanelProps): JSX.Element => {
  const [basicConfigState, dispatchBasicConfigAction] = useReducer(
    basicConfigReducer,
    defaultBasicConfig
  )

  const [weekConfigState, dispatchWeekConfigAction] = useReducer(weekConfigReducer, {
    selectedType: WeekConfigType.Basic,
    basic: defaultWeekConfig,
    dayOfWeek: defaultWeekConfig,
  })

  const [ankiConfigState, dispatchAnkiConfigAction] = useReducer(
    ankiConfigReducer,
    defaultAnkiConfig
  )

  const { deckSize, forecastLength, skipsPerMonth } = basicConfigState
  const useBasicWeek = weekConfigState.selectedType === WeekConfigType.Basic
  const weekConfig = useBasicWeek ? weekConfigState.basic : weekConfigState.dayOfWeek

  const startingSummary = useMemo(() => defaultStartingSummary({ deckSize }), [deckSize])

  useEffect(() => {
    onUpdate({
      startingSummary,
      forecastLength,
      skippedDaysPerMonth: skipsPerMonth,
      ankiConfig: ankiConfigState,
      weekConfig,
    })
  }, [onUpdate, startingSummary, forecastLength, skipsPerMonth, ankiConfigState, weekConfig])

  return (
    <Stack direction="column" spacing={layout.stackSpacing}>
      <BasicConfigPanel state={basicConfigState} dispatch={dispatchBasicConfigAction} />
      <WeekConfigPanel state={weekConfigState} dispatch={dispatchWeekConfigAction} />
      <AnkiConfigPanel state={ankiConfigState} dispatch={dispatchAnkiConfigAction} />
    </Stack>
  )
}

export default ControlPanel
