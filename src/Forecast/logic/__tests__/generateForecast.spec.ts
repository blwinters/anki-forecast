import {
  defaultAnkiConfig,
  defaultWeekConfig,
  WeekConfig,
  DayConfig,
  makeWeekConfigByRepeating,
} from '../types'
import { generateForecast, dayInfoReducer, DayInfoAccumulator } from '../generateForecast'

describe('generateForecast', () => {
  it('returns array of LearningInfo matching forecastLength', () => {
    const forecastLength = 10
    const actual = generateForecast({
      ankiConfig: defaultAnkiConfig,
      weekConfig: defaultWeekConfig,
      forecastLength,
    })

    expect(actual.length).toEqual(forecastLength)
  })

  describe('weekConfig', () => {
    it('returns weekday-based newCards', () => {
      const forecastLength = 10
      const maxReviews = 500
      const newPerWeekday = [50, 50, 20, 50, 50, 0, 0]
      const weekConfig: WeekConfig = newPerWeekday.map((newCards): DayConfig => {
        return {
          newCards,
          maxReviews,
        }
      })

      const expected = newPerWeekday.concat([50, 50, 20])

      const forecast = generateForecast({
        ankiConfig: defaultAnkiConfig,
        weekConfig,
        forecastLength,
      })

      const actual: number[] = forecast.map(dayInfo => dayInfo.cards.new)
      expect(actual.length).toEqual(forecastLength)
      expect(actual).toEqual(expected)
    })

    it('returns weekday-based maxReviews', () => {
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
        ankiConfig: defaultAnkiConfig,
        weekConfig,
        forecastLength,
      })

      const actual: number[] = forecast.map(dayInfo => dayInfo.reviews.max)
      expect(actual.length).toEqual(forecastLength)
      expect(actual).toEqual(expected)
    })
  })
})

describe('dayInfoReducer', () => {
  describe('review counts', () => {
    const weekConfig = makeWeekConfigByRepeating({ newCards: 30, maxReviews: 200 })
    const ankiConfig = {
      ...defaultAnkiConfig,
      baseLearningReviews: 3,
    }
    const startingAcc: DayInfoAccumulator = {
      dayInfoMap: new Map(),
      cardMap: new Map(),
      ankiConfig,
      weekConfig,
    }

    it('uses baseLearningReviews to calculate learning reviews per day', () => {
      const expectedLearningReviews = 90
      const { dayInfoMap } = dayInfoReducer(startingAcc, null, 0)
      const actual = dayInfoMap.get(0)?.reviews.learning ?? 0
      expect(actual).toEqual(expectedLearningReviews)
    })

    it('returns max reviews', () => {
      const expectedMaxReviews = 200
      const { dayInfoMap } = dayInfoReducer(startingAcc, null, 0)
      const actual = dayInfoMap.get(0)?.reviews.max ?? 0
      expect(actual).toEqual(expectedMaxReviews)
    })
  })
})
