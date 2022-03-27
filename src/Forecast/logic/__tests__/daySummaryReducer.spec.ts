import {
  daySummaryReducer,
  daySummaryReducerDefaultValue,
  emptyDaySummary,
  emptyEndCounts,
  getPreviousEndCounts,
} from '../daySummaryReducer'
import { defaultAnkiConfig, makeWeekConfigByRepeating } from '../forecastHelpers'
import { DaySummary, DaySummaryMap } from '../types'

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
    const accumulator = daySummaryReducerDefaultValue(
      startingSummary,
      defaultAnkiConfig,
      weekConfig
    )

    daySummaryReducer(accumulator, null, 0)

    expect(accumulator.newCardsRemaining).toHaveLength(275)
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
