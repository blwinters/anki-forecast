import { defaultAnkiConfig, defaultWeekConfig, WeekConfig, DayConfig } from '../types'
import { generateForecast } from '../generateForecast'

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
      expect(actual).toEqual(expected)
    })
  })
})
