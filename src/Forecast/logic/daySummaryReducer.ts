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
import { appendToCardsByDayAtIndex, scheduleDayCards } from './scheduleDayCards'
import type { Card } from './models/Card'
import { DayCards } from './DayCards'

export type DaySummaryAccumulator = {
  summariesByDay: DaySummaryMap
  newCardsRemaining: Card[]
  skippedDayIndices: number[]
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
  const { ankiConfig, weekConfig, cardsByDay, skippedDayIndices, summariesByDay } = acc

  const weekdayIndex = dayIndex % 7
  const dayConfig: DayConfig = weekConfig[weekdayIndex]

  const dayCards = getDayCards({
    dayIndex,
    dayConfig,
    cardsByDay,
    newCardsRemaining: acc.newCardsRemaining,
  })

  if (skippedDayIndices.includes(dayIndex)) {
    handleSkippedDays({ acc, dayIndex, dayCards })
    return acc
  }

  const { newIds: todayNewIds } = dayCards.getCardIdsByStatus()
  const tomorrowNewCardsRemaining = acc.newCardsRemaining.filter(card => {
    return !todayNewIds.includes(card.id)
  })
  acc.newCardsRemaining = tomorrowNewCardsRemaining

  const cardStatusDiff = scheduleDayCards({ dayIndex, dayCards, cardsByDay, ankiConfig })
  const previousEndCounts = getPreviousEndCounts(summariesByDay, dayIndex)

  const daySummary: DaySummary = {
    reviews: dayCards.getDaySummaryReviews(),
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

interface SkipDayProps {
  acc: DaySummaryAccumulator
  dayIndex: number
  dayCards: DayCards
}

const handleSkippedDays = ({ acc, dayIndex, dayCards }: SkipDayProps) => {
  const daySummaryObject: DaySummary = {
    reviews: emptyReviews,
    endCounts: getPreviousEndCounts(acc.summariesByDay, dayIndex),
  }
  acc.summariesByDay.set(dayIndex, daySummaryObject)

  const { young, mature } = dayCards.getCardArrays()
  const skippedReviews = young.concat(mature)
  appendToCardsByDayAtIndex(acc.cardsByDay, dayIndex + 1, skippedReviews)
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

interface DefaultValueProps {
  startingSummary: DaySummary
  skippedDayIndices: number[]
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
}

export const daySummaryReducerDefaultValue = ({
  startingSummary,
  skippedDayIndices,
  ankiConfig,
  weekConfig,
}: DefaultValueProps): DaySummaryAccumulator => {
  const initialSummaries: DaySummaryMap = new Map()
  initialSummaries.set(-1, startingSummary)

  return {
    summariesByDay: initialSummaries,
    newCardsRemaining: makeNewCardArray(startingSummary.endCounts.newRemaining),
    skippedDayIndices: skippedDayIndices,
    cardsByDay: new Map(),
    ankiConfig,
    weekConfig,
  }
}

export const emptyReviews: DaySummaryReviews = {
  new: 0,
  young: 0,
  mature: 0,
  total: 0,
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
