import { defaultWeekConfig } from './forecastHelpers'

describe('defaultWeekConfig', () => {
  it('has 7 days', () => {
    expect(defaultWeekConfig.length).toEqual(7)
  })
})
