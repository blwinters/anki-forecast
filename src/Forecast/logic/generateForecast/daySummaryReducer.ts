import type {
  DaySummaryMap,
  DayCardsMap,
  AnkiConfig,
  DayConfig,
  WeekConfig,
  DayLearningSummary,
  CardInfo,
  CardStatusDiff,
  DaySummaryEndCounts,
} from './types'
import { getDayCards } from './getDayCards'
import { makeNewCardArray } from './forecastHelpers'
import { scheduleDayCards } from './scheduleDayCards'

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

  const dayCards = getDayCards({
    dayIndex,
    dayConfig,
    cardsByDay,
    newCardsRemaining: acc.newCardsRemaining,
  })

  const cardStatusDiff = scheduleDayCards(dayCards, cardsByDay, ankiConfig)
  const previousEndCounts = summariesByDay.get(dayIndex - 1)!.endCounts //startingSummary guarantees -1

  const daySummary: DayLearningSummary = {
    reviews: dayCards.getDaySummaryReviews(dayConfig.maxReviews),
    endCounts: calculateEndCounts({ previousEndCounts, cardStatusDiff }),
  }

  acc.summariesByDay.set(dayIndex, daySummary)
  return acc
}

interface EndCountProps {
  previousEndCounts: DaySummaryEndCounts
  cardStatusDiff: CardStatusDiff
}

const calculateEndCounts = ({
  previousEndCounts: prevCounts,
  cardStatusDiff: diff,
}: EndCountProps): DaySummaryEndCounts => ({
  learning: prevCounts.learning + diff.learning,
  young: prevCounts.young + diff.young,
  mature: prevCounts.mature + diff.mature,
  totalActive: prevCounts.totalActive - diff.new,
  newRemaining: prevCounts.newRemaining + diff.new,
})

export const daySummaryReducerDefaultValue = (
  startingSummary: DayLearningSummary,
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

export const emptyDaySummary: DayLearningSummary = {
  reviews: {
    new: 0,
    learning: 0,
    young: 0,
    mature: 0,
    total: 0,
    max: 0,
  },
  endCounts: {
    learning: 0,
    young: 0,
    mature: 0,
    totalActive: 0,
    newRemaining: 0,
  },
}
