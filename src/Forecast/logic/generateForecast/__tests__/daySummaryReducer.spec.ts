import {
  daySummaryReducer,
  daySummaryReducerDefaultValue,
  emptyDaySummary,
} from '../daySummaryReducer'
import { defaultAnkiConfig, makeWeekConfigByRepeating } from '../forecastHelpers'
import { DaySummary } from '../types'

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
