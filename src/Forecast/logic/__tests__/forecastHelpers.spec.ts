import { defaultWeekConfig, getSkippedDayIndices } from '../forecastHelpers'

describe('defaultWeekConfig', () => {
  it('has 7 days', () => {
    expect(defaultWeekConfig).toHaveLength(7)
  })
})

describe('skippedDayIndices', () => {
  let forecastLength: number

  beforeEach(() => {
    forecastLength = 170
  })

  it('returns array of length matching skips per month and forecast length', () => {
    const skippedDaysPerMonth = 4
    const expectedTotalSkips = 22
    const actual = getSkippedDayIndices(skippedDaysPerMonth, forecastLength)
    expect(actual).toHaveLength(expectedTotalSkips)
  })

  it('returns empty array for negative number', () => {
    const actual = getSkippedDayIndices(-1, forecastLength)
    expect(actual).toHaveLength(0)
  })

  it('distributes skip days evenly over middle of range', () => {
    forecastLength = 60
    const skippedDaysPerMonth = 3
    const expectedSkippedIndices = [4, 14, 24, 34, 44, 54]
    const actual = getSkippedDayIndices(skippedDaysPerMonth, forecastLength)
    expect(actual).toEqual(expectedSkippedIndices)
  })
})
