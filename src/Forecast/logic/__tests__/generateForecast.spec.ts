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
    it('observes new card count for each weekday', () => {
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

      const actual: number[] = forecast.map(dayInfo => dayInfo.newCards)
      expect(actual).toEqual(expected)
    })
  })
})
