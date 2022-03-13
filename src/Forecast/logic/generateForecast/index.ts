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
  const reducerDefaultValue = daySummaryReducerDefaultValue(startingSummary, ankiConfig, weekConfig)
  const arrayOfLength = Array.from({ length: forecastLength }, () => null)
  const summariesByDay: DaySummaryMap = arrayOfLength.reduce(
    daySummaryReducer,
    reducerDefaultValue
  ).summariesByDay

  summariesByDay.delete(-1) //remove initial summary

  const dayIndices = Array.from(summariesByDay.keys()).sort()
  return dayIndices.map(dayIndex => summariesByDay.get(dayIndex) ?? emptyDaySummary)
}
