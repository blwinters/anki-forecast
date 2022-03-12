import {
  AnkiConfig,
  WeekConfig,
  DayLearningSummary,
  DayConfig,
  DaySummaryMap,
  DayCardsMap,
  CardStatus,
} from './types'

import { matureCardThreshold } from './forecastHelpers'

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

const emptyDaySummary: DayLearningSummary = {
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

const getReviewCounts = (cardCountProps: CardCountProps) => {
  return {
    newReviews: startingReviewsForStatus(CardStatus.new, cardCountProps),
    learningReviews: startingReviewsForStatus(CardStatus.learning, cardCountProps),
    youngReviews: startingReviewsForStatus(CardStatus.young, cardCountProps),
    matureReviews: startingReviewsForStatus(CardStatus.mature, cardCountProps),
  }
}

interface CardCountProps {
  dayIndex: number
  dayConfig: DayConfig
  cardsByDay: DayCardsMap
  newCardsRemaining: number
}

const startingReviewsForStatus = (
  status: CardStatus,
  { dayIndex, dayConfig, cardsByDay, newCardsRemaining }: CardCountProps
): number => {
  const dueCards = cardsByDay.get(dayIndex) ?? []

  switch (status) {
    case CardStatus.new:
      return Math.min(dayConfig.newCards, newCardsRemaining)
    case CardStatus.learning:
      const learningCards = dueCards.filter(card => {
        return card.latestInterval > 0 && card.latestInterval < 1
      })
      return learningCards.length
    case CardStatus.young:
      const youngCards = dueCards.filter(card => {
        return card.latestInterval >= 1 && card.latestInterval < matureCardThreshold
      })
      return youngCards.length
    case CardStatus.mature:
      const matureCards = dueCards.filter(card => {
        return card.latestInterval >= matureCardThreshold
      })
      return matureCards.length
    default:
      return 0
  }
}
