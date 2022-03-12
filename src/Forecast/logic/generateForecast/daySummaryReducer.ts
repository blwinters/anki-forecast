import type {
  DaySummaryMap,
  DayCardsMap,
  AnkiConfig,
  DayConfig,
  WeekConfig,
  DayLearningSummary,
} from './types'
import { getReviewCounts } from './getReviewCounts'

export type DaySummaryAccumulator = {
  summariesByDay: DaySummaryMap
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

  const { newReviews, learningReviews, youngReviews, matureReviews } = getReviewCounts({
    dayIndex,
    dayConfig,
    cardsByDay,
    newCardsRemaining: previousDaySummary.endingCards.new,
  })

  //TODO: handle existing learning cards, accounting for
  //latest interval and learning graduation threshold
  const learningReviewCount = newReviews * ankiConfig.baseLearningReviews + learningReviews

  const daySummary: DayLearningSummary = {
    endingCards: {
      new: previousDaySummary.endingCards.new - newReviews,
      young: 0,
      mature: 0,
      totalActive: 0,
    },
    reviews: {
      new: newReviews,
      learning: learningReviewCount,
      young: youngReviews,
      mature: matureReviews,
      max: dayConfig.maxReviews,
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
    cardsByDay: new Map(),
    ankiConfig,
    weekConfig,
  }
}

export const emptyDaySummary: DayLearningSummary = {
  endingCards: {
    new: 0,
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
}
