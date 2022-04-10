import { Paper, Stack } from '@mui/material'
import { BasicConfig } from '../../logic'
import { BasicConfigAction } from './BasicConfigReducer'
import NumberInput, { NumberInputProps } from './NumberInput'

interface Props {
  state: BasicConfig
  dispatch: (action: BasicConfigAction) => void
}

export const BasicConfigPanel = ({ state, dispatch }: Props) => {
  const setForecastLength = (value: number) => {
    dispatch({
      type: 'SET_FORECAST_LENGTH',
      payload: {
        value,
      },
    })
  }

  const setDeckSize = (value: number) => {
    dispatch({
      type: 'SET_DECK_SIZE',
      payload: {
        value,
      },
    })
  }

  const setSkipsPerMonth = (value: number) => {
    dispatch({
      type: 'SET_SKIPS_PER_MONTH',
      payload: {
        value,
      },
    })
  }

  const numberInputs: NumberInputProps[] = [
    {
      label: '# of cards',
      value: state.deckSize,
      submitValue: setDeckSize,
      maxValue: 100_000,
    },
    {
      label: '# of days',
      value: state.forecastLength,
      submitValue: setForecastLength,
      maxValue: 730,
    },
    {
      label: 'Skip days per month',
      value: state.skipsPerMonth,
      submitValue: setSkipsPerMonth,
      maxValue: 15,
    },
  ]

  return (
    <Paper elevation={1} sx={{ padding: 3 }}>
      <Stack spacing={2}>
        {numberInputs.map((props, index) => (
          <NumberInput key={index} {...props} />
        ))}
      </Stack>
    </Paper>
  )
}
