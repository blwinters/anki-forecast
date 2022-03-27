import { AnkiConfig, WeekConfig, DaySummary, DaySummaryMap } from './types'
import {
  daySummaryReducer,
  daySummaryReducerDefaultValue,
  emptyDaySummary,
} from './daySummaryReducer'

export interface ForecastProps {
  startingSummary: DaySummary
  forecastLength: number
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
}

export const generateForecast = ({
  startingSummary,
  forecastLength,
  ankiConfig,
  weekConfig,
}: ForecastProps): DaySummary[] => {
  const reducerDefaultValue = daySummaryReducerDefaultValue(startingSummary, ankiConfig, weekConfig)
  const arrayOfLength = Array.from({ length: forecastLength }, () => null)
  const summariesByDay: DaySummaryMap = arrayOfLength.reduce(
    daySummaryReducer,
    reducerDefaultValue
  ).summariesByDay

  summariesByDay.delete(-1) //remove initial summary

  const dayIndices = Array.from(summariesByDay.keys()).sort((a, b) => a - b)
  return dayIndices.map(dayIndex => dayIndicesMapper(dayIndex, summariesByDay))
}

export const dayIndicesMapper = (dayIndex: number, summariesByDay: DaySummaryMap): DaySummary => {
  return summariesByDay.get(dayIndex) ?? emptyDaySummary
}
