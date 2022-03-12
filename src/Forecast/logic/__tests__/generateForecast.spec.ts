import type { WeekConfig, DayConfig, CardInfo } from '../types'
import { defaultAnkiConfig, defaultWeekConfig, makeWeekConfigByRepeating } from '../forecastHelpers'
import {
  generateForecast,
  daySummaryReducer,
  DaySummaryAccumulator,
  defaultStartingSummary,
  daySummaryReducerDefaultValue,
} from '../generateForecast'

describe('generateForecast', () => {
  it('returns array matching forecastLength', () => {
    const forecastLength = 10
    const actual = generateForecast({
      startingSummary: defaultStartingSummary(500),
      ankiConfig: defaultAnkiConfig,
      weekConfig: defaultWeekConfig,
      forecastLength,
    })

    expect(actual.length).toEqual(forecastLength)
  })

  describe('weekConfig', () => {
    it('returns weekday-based new cards', () => {
      const forecastLength = 10
      const maxReviews = 500
      const newPerWeekday = [50, 50, 20, 50, 50, 0, 0]
      const weekConfig: WeekConfig = newPerWeekday.map(
        (newCards): DayConfig => ({
          newCards,
          maxReviews,
        })
      )

      const expected = newPerWeekday.concat([50, 50, 20])

      const forecast = generateForecast({
        startingSummary: defaultStartingSummary(500),
        ankiConfig: defaultAnkiConfig,
        weekConfig,
        forecastLength,
      })

      const actual: number[] = forecast.map(daySummary => daySummary.reviews.new)
      expect(actual).toEqual(expected)
      expect(actual.length).toEqual(forecastLength)
    })

    it('returns weekday-based max reviews', () => {
      const forecastLength = 10
      const newPerWeekday = [50, 50, 20, 50, 50, 0, 0]
      const maxReviewsPerWeekday = [500, 500, 200, 500, 500, 1000, 1000]
      const weekConfig: WeekConfig = Array.from({ length: 7 }, (_, i): DayConfig => {
        return {
          newCards: newPerWeekday[i],
          maxReviews: maxReviewsPerWeekday[i],
        }
      })

      const expected = maxReviewsPerWeekday.concat([500, 500, 200])

      const forecast = generateForecast({
        startingSummary: defaultStartingSummary(500),
        ankiConfig: defaultAnkiConfig,
        weekConfig,
        forecastLength,
      })

      const actual: number[] = forecast.map(daySummary => daySummary.reviews.max)
      expect(actual).toEqual(expected)
      expect(actual.length).toEqual(forecastLength)
    })
  })
})

describe('daySummaryReducer', () => {
  describe('review counts', () => {
    const weekConfig = makeWeekConfigByRepeating({ newCards: 30, maxReviews: 200 })
    const ankiConfig = {
      ...defaultAnkiConfig,
      baseLearningReviews: 3,
    }
    let startingAcc: DaySummaryAccumulator

    beforeEach(() => {
      const startingSummary = defaultStartingSummary(500)
      startingAcc = daySummaryReducerDefaultValue(startingSummary, ankiConfig, weekConfig)
    })

    it('limits new cards by total new cards remaining', () => {
      //
    })

    it('uses baseLearningReviews to calculate learning reviews per day', () => {
      const expectedLearningReviews = 90
      const { summariesByDay } = daySummaryReducer(startingAcc, null, 0)
      const actual = summariesByDay.get(0)?.reviews.learning ?? 0
      expect(actual).toEqual(expectedLearningReviews)
    })

    describe('max reviews', () => {
      it('returns max reviews', () => {
        const expectedMaxReviews = 200
        const { summariesByDay } = daySummaryReducer(startingAcc, null, 0)
        const actual = summariesByDay.get(0)?.reviews.max ?? 0
        expect(actual).toEqual(expectedMaxReviews)
      })

    })
  })
})
