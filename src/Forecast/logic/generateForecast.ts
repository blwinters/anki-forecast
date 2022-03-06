import { AnkiConfig, WeekConfig, DayLearningInfo, DayConfig, DayInfoMap, CardMap } from './types'

interface Props {
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
  forecastLength: number
}

export const generateForecast = ({
  ankiConfig,
  weekConfig,
  forecastLength,
}: Props): DayLearningInfo[] => {
  const arrayOfLength = Array.from({ length: forecastLength }, () => null)

  const dayInfoMap: DayInfoMap = arrayOfLength.reduce(dayInfoReducer, {
    dayInfoMap: new Map(),
    cardMap: new Map(),
    ankiConfig,
    weekConfig,
  }).dayInfoMap

  const dayIndices = Array.from(dayInfoMap.keys()).sort()
  return dayIndices.map(dayIndex => dayInfoMap.get(dayIndex) ?? emptyDayInfo)
}

export type DayInfoAccumulator = {
  dayInfoMap: DayInfoMap
  cardMap: CardMap
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
      young: 0,
      mature: 0,
      totalActive: 0,
    },
    reviews: {
      learning: learningReviewCount,
      young: 0,
      mature: 0,
      max: dayOfWeekConfig.maxReviews,
    },
  }

  acc.dayInfoMap.set(dayIndex, dayInfo)
  return acc
}

const emptyDayInfo: DayLearningInfo = {
  cards: {
    new: 0,
    young: 0,
    mature: 0,
    totalActive: 0,
  },
  reviews: {
    learning: 0,
    young: 0,
    mature: 0,
    max: 0,
  },
}
