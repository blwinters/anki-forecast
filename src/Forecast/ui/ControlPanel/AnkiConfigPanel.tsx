import { Stack } from '@mui/material'
import { AnkiConfig } from '../../logic'
import { AnkiConfigAction, AnkiConfigActionType } from './AnkiConfigReducer'
import NumberInput from './NumberInput'
import { layout } from '../styles'

interface PanelProps {
  state: AnkiConfig
  dispatch: (action: AnkiConfigAction) => void
}

const AnkiConfigPanel = ({ state, dispatch }: PanelProps) => {
  const inputProps: MapperProps[] = [
    {
      label: 'Graduating Interval',
      value: state.graduatingInterval,
      actionType: 'SET_GRADUATING_INTERVAL',
      dispatch,
    },
    {
      label: 'Max Interval',
      value: state.maxInterval,
      actionType: 'SET_MAX_INTERVAL',
      dispatch,
    },
    {
      label: 'Starting Ease',
      value: state.goodMultiplier,
      actionType: 'SET_GOOD_MULTIPLIER',
      dispatch,
    },
  ]

  return <Stack spacing={layout.stackSpacing}>{inputProps.map(mapPropsToNumberInput)}</Stack>
}

interface MapperProps {
  label: string
  value: number
  actionType: AnkiConfigActionType
  dispatch: (action: AnkiConfigAction) => void
}

const mapPropsToNumberInput = ({
  label,
  value,
  actionType,
  dispatch,
}: MapperProps): JSX.Element => {
  const onSubmitValue = (newValue: number) => {
    dispatch({ type: actionType, payload: { value: newValue } })
  }

  return <NumberInput label={label} value={value} submitValue={onSubmitValue} />
}

export default AnkiConfigPanel
