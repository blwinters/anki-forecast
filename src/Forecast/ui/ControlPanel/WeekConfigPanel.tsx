import { Box, Grid, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { DayConfig, DayOfWeekIndex } from '../../logic'
import { layout } from '../styles'
import NumberInput, { NumberInputProps } from './NumberInput'
import { WeekConfigAction, WeekConfigState } from './WeekConfigReducer'

interface Props {
  state: WeekConfigState
  dispatch: (action: WeekConfigAction) => void
}

export enum WeekConfigType {
  Basic,
  DayOfWeek,
}

const MAX_MAX_REVIEWS_PER_DAY = 5000
const MAX_NEW_CARDS_PER_DAY = 500

const WeekConfigPanel = ({ state, dispatch }: Props) => {
  const configType = state.selectedType
  const isBasic = configType === WeekConfigType.Basic

  const onPressConfigType = (value: WeekConfigType) => {
    dispatch({
      type: 'SET_WEEK_CONFIG_TYPE',
      payload: {
        value,
      },
    })
  }

  return (
    <Stack spacing={2}>
      <Box>Cards Per Day</Box>
      <WeekConfigTypeToggle value={state.selectedType} onPress={onPressConfigType} />
      {isBasic && <BasicWeekConfig state={state} dispatch={dispatch} />}
      {!isBasic && <DayOfWeekConfig state={state} dispatch={dispatch} />}
    </Stack>
  )
}

interface ToggleProps {
  value: WeekConfigType
  onPress: (value: WeekConfigType) => void
}

const WeekConfigTypeToggle = ({ value: alignment, onPress: setAlignment }: ToggleProps) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newAlignment: WeekConfigType) => {
    setAlignment(newAlignment)
  }

  return (
    <ToggleButtonGroup
      color="primary"
      size="small"
      value={alignment}
      exclusive
      onChange={handleChange}>
      <ToggleButton value={WeekConfigType.Basic}>Basic</ToggleButton>
      <ToggleButton value={WeekConfigType.DayOfWeek}>Day of Week</ToggleButton>
    </ToggleButtonGroup>
  )
}

const BasicWeekConfig = ({ state, dispatch }: Props) => {
  const { newCards, maxReviews } = state.basic[0]

  const setNewPerDay = (value: number) => {
    dispatch({
      type: 'SET_ALL_NEW_CARDS',
      payload: {
        value,
      },
    })
  }

  const setMaxReviews = (value: number) => {
    dispatch({
      type: 'SET_ALL_MAX_REVIEWS',
      payload: {
        value,
      },
    })
  }

  const numberInputs: NumberInputProps[] = [
    {
      label: 'New cards',
      value: newCards,
      submitValue: setNewPerDay,
      maxValue: MAX_NEW_CARDS_PER_DAY,
    },
    {
      label: 'Max reviews',
      value: maxReviews,
      submitValue: setMaxReviews,
      maxValue: MAX_MAX_REVIEWS_PER_DAY,
    },
  ]

  return (
    <Stack direction="column" spacing={layout.stackSpacing} style={{ marginBottom: '30px' }}>
      {numberInputs.map((props, index) => (
        <NumberInput key={index} {...props} />
      ))}
    </Stack>
  )
}

const DayOfWeekConfig = ({ state, dispatch }: Props) => {
  const setNewCards = (dayOfWeek: DayOfWeekIndex, value: number) => {
    dispatch({
      type: 'SET_DAY_NEW_CARDS',
      payload: {
        dayIndex: dayOfWeek,
        value,
      },
    })
  }

  const setMaxReviews = (dayOfWeek: DayOfWeekIndex, value: number) => {
    dispatch({
      type: 'SET_DAY_MAX_REVIEWS',
      payload: {
        dayIndex: dayOfWeek,
        value,
      },
    })
  }

  return (
    <Stack direction="column">
      {state.dayOfWeek.map((dayConfig, index) => {
        const dayOfWeek = index as DayOfWeekIndex
        return (
          <DayInputs
            key={index}
            dayConfig={dayConfig}
            dayOfWeek={dayOfWeek}
            setNewCards={value => setNewCards(dayOfWeek, value)}
            setMaxReviews={value => setMaxReviews(dayOfWeek, value)}
          />
        )
      })}
    </Stack>
  )
}

interface DayProps {
  dayConfig: DayConfig
  dayOfWeek: DayOfWeekIndex
  setNewCards: (value: number) => void
  setMaxReviews: (value: number) => void
}

const DayInputs = ({ dayConfig, dayOfWeek, setNewCards, setMaxReviews }: DayProps) => {
  const newCardsProps: NumberInputProps = {
    value: dayConfig.newCards,
    submitValue: setNewCards,
    maxValue: MAX_NEW_CARDS_PER_DAY,
  }

  const maxReviewsProps: NumberInputProps = {
    value: dayConfig.maxReviews,
    submitValue: setMaxReviews,
    maxValue: MAX_MAX_REVIEWS_PER_DAY,
  }

  return (
    <Grid container spacing={1} style={{ alignItems: 'center' }}>
      <Grid item width={50}>
        {labelForDayOfWeek(dayOfWeek)}
      </Grid>
      <Grid item>
        <NumberInput {...newCardsProps} />
      </Grid>
      <Grid item>
        <NumberInput {...maxReviewsProps} />
      </Grid>
    </Grid>
  )
}

const labelForDayOfWeek = (dayIndex: DayOfWeekIndex): string => {
  switch (dayIndex) {
    case 0:
      return 'Mon'
    case 1:
      return 'Tue'
    case 2:
      return 'Wed'
    case 3:
      return 'Thu'
    case 4:
      return 'Fri'
    case 5:
      return 'Sat'
    case 6:
    default:
      return 'Sun'
  }
}

export default WeekConfigPanel
