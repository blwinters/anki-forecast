import type {
  DaySummaryMap,
  DayCardsMap,
  AnkiConfig,
  DayConfig,
  WeekConfig,
  DaySummary,
  CardStatusDiff,
  DaySummaryEndCounts,
  DaySummaryReviews,
} from './types'
import { getDayCards } from './getDayCards'
import { makeNewCardArray } from './forecastHelpers'
import { scheduleDayCards } from './scheduleDayCards'
import type { Card } from './models/Card'

export type DaySummaryAccumulator = {
  summariesByDay: DaySummaryMap
  newCardsRemaining: Card[]
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

  const dayCards = getDayCards({
    dayIndex,
    dayConfig,
    cardsByDay,
    newCardsRemaining: acc.newCardsRemaining,
  })

  const { newIds: todayNewIds } = dayCards.getCardIdsByStatus()
  const tomorrowNewCardsRemaining = acc.newCardsRemaining.filter(card => {
    return !todayNewIds.includes(card.id)
  })
  acc.newCardsRemaining = tomorrowNewCardsRemaining

  const cardStatusDiff = scheduleDayCards({ dayIndex, dayCards, cardsByDay, ankiConfig })
  const previousEndCounts = getPreviousEndCounts(summariesByDay, dayIndex)

  const daySummary: DaySummary = {
    reviews: dayCards.getDaySummaryReviews(dayConfig.maxReviews),
    endCounts: calculateEndCounts({ previousEndCounts, cardStatusDiff }),
  }

  acc.summariesByDay.set(dayIndex, daySummary)
  return acc
}

export const getPreviousEndCounts = (
  summariesByDay: DaySummaryMap,
  dayIndex: number
): DaySummaryEndCounts => {
  return summariesByDay.get(dayIndex - 1)?.endCounts ?? emptyEndCounts
}

interface EndCountProps {
  previousEndCounts: DaySummaryEndCounts
  cardStatusDiff: CardStatusDiff
}

const calculateEndCounts = ({
  previousEndCounts: prevCounts,
  cardStatusDiff: diff,
}: EndCountProps): DaySummaryEndCounts => ({
  young: prevCounts.young + diff.young,
  mature: prevCounts.mature + diff.mature,
  totalActive: prevCounts.totalActive - diff.new,
  newRemaining: prevCounts.newRemaining + diff.new,
})

export const daySummaryReducerDefaultValue = (
  startingSummary: DaySummary,
  ankiConfig: AnkiConfig,
  weekConfig: WeekConfig
): DaySummaryAccumulator => {
  const initialSummaries: DaySummaryMap = new Map()
  initialSummaries.set(-1, startingSummary)

  return {
    summariesByDay: initialSummaries,
    newCardsRemaining: makeNewCardArray(startingSummary.endCounts.newRemaining),
    cardsByDay: new Map(),
    ankiConfig,
    weekConfig,
  }
}

const emptyReviews: DaySummaryReviews = {
  new: 0,
  young: 0,
  mature: 0,
  total: 0,
  max: 0,
}

export const emptyEndCounts: DaySummaryEndCounts = {
  young: 0,
  mature: 0,
  totalActive: 0,
  newRemaining: 0,
}

export const emptyDaySummary: DaySummary = {
  reviews: emptyReviews,
  endCounts: emptyEndCounts,
}
