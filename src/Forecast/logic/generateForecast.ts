import { AnkiConfig, WeekConfig, DayLearningInfo, DayConfig } from './types'

interface Props {
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
  forecastLength: number
}

type DayInfoMap = Map<number, DayLearningInfo>

export const generateForecast = ({
  ankiConfig,
  weekConfig,
  forecastLength,
}: Props): DayLearningInfo[] => {
  const arrayOfLength = Array.from({ length: forecastLength }, () => null)

  const dayInfoMap: DayInfoMap = arrayOfLength.reduce(dayInfoReducer, {
    dayInfoMap: new Map<number, DayLearningInfo>(),
    ankiConfig,
    weekConfig,
  }).dayInfoMap

  const dayIndices = Array.from(dayInfoMap.keys()).sort()
  return dayIndices.map(dayIndex => dayInfoMap.get(dayIndex) ?? emptyDayInfo)
}

export type DayInfoAccumulator = {
  dayInfoMap: DayInfoMap
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
}

type DayInfoReducer = (acc: DayInfoAccumulator, value: null, dayIndex: number) => DayInfoAccumulator

export const dayInfoReducer: DayInfoReducer = (acc, _, dayIndex) => {
  const weekdayIndex = dayIndex % 7
  const dayOfWeekConfig: DayConfig = acc.weekConfig[weekdayIndex]

  const newCards = dayOfWeekConfig.newCards
  const learningReviewCount = newCards * acc.ankiConfig.baseLearningReviews

  const dayInfo: DayLearningInfo = {
    cards: {
      new: newCards,
    },
    reviews: {
      learning: learningReviewCount,
      max: dayOfWeekConfig.maxReviews,
    },
  }

  acc.dayInfoMap.set(dayIndex, dayInfo)
  return acc
}

const emptyDayInfo: DayLearningInfo = {
  cards: {
    new: 0,
  },
  reviews: {
    learning: 0,
    max: 0,
  },
}
