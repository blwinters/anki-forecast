import {
  daySummaryReducer,
  daySummaryReducerDefaultValue,
  emptyDaySummary,
  emptyEndCounts,
  emptyReviews,
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
    const dayIndex = 8
    const skippedDayIndices = [2, 8, 14, 20]
    const acc = daySummaryReducerDefaultValue({
      startingSummary: emptyDaySummary,
      skippedDayIndices,
      ankiConfig: defaultAnkiConfig,
      weekConfig: defaultWeekConfig,
    })

    const previousDaySummary: DaySummary = {
      reviews: {
        new: 10,
        young: 10,
        mature: 5,
        total: 30,
      },
      endCounts: {
        young: 50,
        mature: 20,
        totalActive: 100,
        newRemaining: 500,
      },
    }

    acc.summariesByDay.set(dayIndex - 1, previousDaySummary)

    const youngCards = makeCardArray(CardStatus.young, 10)
    acc.cardsByDay.set(dayIndex, youngCards)
    expect(acc.cardsByDay.get(dayIndex)).toEqual(youngCards)

    daySummaryReducer(acc, null, dayIndex)

    const expectedSkipDaySummary: DaySummary = {
      reviews: emptyReviews,
      endCounts: previousDaySummary.endCounts,
    }

    expect(acc.summariesByDay.get(dayIndex)).toEqual(expectedSkipDaySummary)

    const nextDayCards = acc.cardsByDay.get(dayIndex + 1) ?? []
    const nextDayIncludesSkippedCards = youngCards.reduce((accumulator, card) => {
      return accumulator && nextDayCards.includes(card)
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
