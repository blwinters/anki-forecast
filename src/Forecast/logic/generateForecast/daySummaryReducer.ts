import type {
  DaySummaryMap,
  DayCardsMap,
  AnkiConfig,
  DayConfig,
  WeekConfig,
  DayLearningSummary,
  CardInfo,
} from './types'
import { getDayCards } from './getDayCards'
import { makeNewCardArray } from './forecastHelpers'

export type DaySummaryAccumulator = {
  summariesByDay: DaySummaryMap
  newCardsRemaining: CardInfo[]
  cardsByDay: DayCardsMap
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
}

type DaySummaryReducer = (
  acc: DaySummaryAccumulator,
  value: null,
  dayIndex: number
) => DaySummaryAccumulator

export const daySummaryReducer: DaySummaryReducer = (acc, _, dayIndex) => {
  const { ankiConfig, weekConfig, cardsByDay, summariesByDay } = acc

  const weekdayIndex = dayIndex % 7
  const dayConfig: DayConfig = weekConfig[weekdayIndex]

  const previousDaySummary = summariesByDay.get(dayIndex - 1)! //startingSummary is -1

  const { newCards, learning, young, mature, total } = getDayCards({
    dayIndex,
    dayConfig,
    cardsByDay,
    newCardsRemaining: acc.newCardsRemaining,
  }).counts()

  const daySummary: DayLearningSummary = {
    reviews: {
      new: newCards,
      learning,
      young,
      mature,
      total,
      max: dayConfig.maxReviews,
    },
    endingCards: {
      learning: 0,
      young: 0,
      mature: 0,
      totalActive: 0,
      newRemaining: previousDaySummary.endingCards.newRemaining - newCards,
    },
  }

  acc.summariesByDay.set(dayIndex, daySummary)
  return acc
}

export const daySummaryReducerDefaultValue = (
  startingSummary: DayLearningSummary,
  ankiConfig: AnkiConfig,
  weekConfig: WeekConfig
): DaySummaryAccumulator => {
  const initialSummaries: DaySummaryMap = new Map()
  initialSummaries.set(-1, startingSummary)

  return {
    summariesByDay: initialSummaries,
    newCardsRemaining: makeNewCardArray(startingSummary.endingCards.newRemaining),
    cardsByDay: new Map(),
    ankiConfig,
    weekConfig,
  }
}

export const emptyDaySummary: DayLearningSummary = {
  reviews: {
    new: 0,
    learning: 0,
    young: 0,
    mature: 0,
    total: 0,
    max: 0,
  },
  endingCards: {
    learning: 0,
    young: 0,
    mature: 0,
    totalActive: 0,
    newRemaining: 0,
  },
}
