import { AnkiConfig, WeekConfig, DayLearningSummary, DaySummaryMap } from './types'
import {
  daySummaryReducer,
  daySummaryReducerDefaultValue,
  emptyDaySummary,
} from './daySummaryReducer'

interface Props {
  startingSummary: DayLearningSummary
  forecastLength: number
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
}

export const generateForecast = ({
  startingSummary,
  forecastLength,
  ankiConfig,
  weekConfig,
}: Props): DayLearningSummary[] => {
  const arrayOfLength = Array.from({ length: forecastLength }, () => null)

  const reducerDefaultValue = daySummaryReducerDefaultValue(startingSummary, ankiConfig, weekConfig)
  const summariesByDay: DaySummaryMap = arrayOfLength.reduce(
    daySummaryReducer,
    reducerDefaultValue
  ).summariesByDay

  summariesByDay.delete(-1) //remove initial summary

  const dayIndices = Array.from(summariesByDay.keys()).sort()
  return dayIndices.map(dayIndex => summariesByDay.get(dayIndex) ?? emptyDaySummary)
}

export const defaultStartingSummary = (deckSize: number): DayLearningSummary => ({
  endingCards: {
    new: deckSize,
    young: 0,
    mature: 0,
    totalActive: 0,
  },
  reviews: {
    new: 0,
    learning: 0,
    young: 0,
    mature: 0,
    max: 0,
  },
})
