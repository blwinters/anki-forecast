import {
  daySummaryReducer,
  daySummaryReducerDefaultValue,
  emptyDaySummary,
  emptyEndCounts,
  getPreviousEndCounts,
} from '../daySummaryReducer'
import {
  defaultAnkiConfig,
  defaultWeekConfig,
  makeCardArray,
  makeWeekConfigByRepeating,
} from '../forecastHelpers'
import { CardStatus, DaySummary, DaySummaryMap } from '../types'

describe('daySummaryReducer', () => {
  it('removes new cards from cards remaining', () => {
    const newCardsPerDay = 25
    const weekConfig = makeWeekConfigByRepeating({
      newCards: newCardsPerDay,
      maxReviews: 500,
    })
    const startingSummary: DaySummary = {
      reviews: emptyDaySummary.reviews,
      endCounts: {
        ...emptyDaySummary.endCounts,
        newRemaining: 300,
      },
    }
    const accumulator = daySummaryReducerDefaultValue({
      startingSummary,
      ankiConfig: defaultAnkiConfig,
      skippedDayIndices: [],
      weekConfig,
    })

    daySummaryReducer(accumulator, null, 0)

    expect(accumulator.newCardsRemaining).toHaveLength(275)
  })

  it('skips skippedDayIndices', () => {
    const skippedDayIndices = [2, 8, 14, 20]
    const accumulator = daySummaryReducerDefaultValue({
      startingSummary: emptyDaySummary,
      skippedDayIndices,
      ankiConfig: defaultAnkiConfig,
      weekConfig: defaultWeekConfig,
    })

    const dayIndex = 8

    const youngCards = makeCardArray(CardStatus.young, 10)
    accumulator.cardsByDay.set(dayIndex, youngCards)
    expect(accumulator.cardsByDay.get(dayIndex)).toEqual(youngCards)

    daySummaryReducer(accumulator, null, dayIndex)

    expect(accumulator.summariesByDay.get(dayIndex)).toEqual(emptyDaySummary)

    const nextDayCards = accumulator.cardsByDay.get(dayIndex + 1) ?? []
    const nextDayIncludesSkippedCards = youngCards.reduce((acc, card) => {
      return acc && nextDayCards.includes(card)
    }, true)
    expect(nextDayIncludesSkippedCards).toBeTruthy()
  })
})

describe('getPreviousEndCounts', () => {
  it('returns emptyEndCounts for index without summary', () => {
    const summariesByDay: DaySummaryMap = new Map()
    const dayIndex = 1
    expect(summariesByDay.get(dayIndex)).toBeUndefined()

    const actual = getPreviousEndCounts(summariesByDay, dayIndex)
    expect(actual).toEqual(emptyEndCounts)
  })
})
