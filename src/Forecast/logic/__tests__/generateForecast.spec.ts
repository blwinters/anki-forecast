import type { WeekConfig, DayConfig, DaySummaryMap } from '../types'
import { defaultAnkiConfig, defaultWeekConfig, defaultStartingSummary } from '../forecastHelpers'
import { dayIndicesMapper, generateForecast } from '../generateForecast'
import { emptyDaySummary } from '../daySummaryReducer'

describe('generateForecast', () => {
  it('returns array matching forecastLength', () => {
    const forecastLength = 10
    const actual = generateForecast({
      startingSummary: defaultStartingSummary({ deckSize: 500 }),
      ankiConfig: defaultAnkiConfig,
      weekConfig: defaultWeekConfig,
      forecastLength,
    })

    expect(actual).toHaveLength(forecastLength)
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
        startingSummary: defaultStartingSummary({ deckSize: 500 }),
        ankiConfig: defaultAnkiConfig,
        weekConfig,
        forecastLength,
      })

      const actual: number[] = forecast.map(daySummary => daySummary.reviews.new)
      expect(actual).toEqual(expected)
      expect(actual).toHaveLength(forecastLength)
    })
  })
})

describe('dayIndicesMapper', () => {
  it('returns empty summary if no summary for index', () => {
    const dayIndex = 1
    const summariesByDay: DaySummaryMap = new Map()
    expect(summariesByDay.get(dayIndex)).toBeUndefined()

    const actual = dayIndicesMapper(dayIndex, summariesByDay)
    expect(actual).toEqual(emptyDaySummary)
  })
})
