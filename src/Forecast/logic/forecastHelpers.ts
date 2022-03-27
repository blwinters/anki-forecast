import { DaySummary, DayConfig, WeekConfig, AnkiConfig, CardStatus, BasicConfig } from './types'
import { Card } from './models/Card'

export const makeWeekConfigByRepeating = (dayConfig: DayConfig): WeekConfig => {
  return Array.from({ length: 7 }, () => dayConfig)
}

export const defaultDayConfig: DayConfig = {
  newCards: 20,
  maxReviews: 200,
}

export const defaultBasicConfig: BasicConfig = {
  deckSize: 1000,
  forecastLength: 180,
}

export const defaultWeekConfig: WeekConfig = makeWeekConfigByRepeating(defaultDayConfig)

export const matureCardThreshold = 21

export const defaultAnkiConfig: AnkiConfig = {
  reviewAccuracy: 0.9,
  graduatingInterval: 1,
  maxInterval: 180, //default is 36,500
  againMultiplier: 0, //new interval
  goodMultiplier: 2.5, //starting ease
  intervalModifier: 1.0,
}

export const defaultStartingSummary = ({ deckSize }: { deckSize: number }): DaySummary => ({
  reviews: {
    new: 0,
    young: 0,
    mature: 0,
    total: 0,
  },
  endCounts: {
    young: 0,
    mature: 0,
    totalActive: 0,
    newRemaining: deckSize,
  },
})

export const makeNewCardArray = (length: number) => {
  return makeCardArray(CardStatus.new, length)
}

export const makeCardArray = (
  status: CardStatus,
  length: number,
  latestInterval?: number
): Card[] => {
  const baseArray = Array.from({ length: length }, () => null)
  return baseArray.map((_, index) => {
    const lastInterval = latestInterval ?? testingIntervalForIndex(index, status)
    return new Card(lastInterval)
  })
}

const testingIntervalForIndex = (
  index: number,
  status: CardStatus,
  graduatingInterval = 1
): number => {
  const rangeFraction = 1 / (index + 2)
  const rangeValue = (matureCardThreshold - 1) * rangeFraction

  switch (status) {
    case CardStatus.young:
      return graduatingInterval + Math.round(rangeValue)
    case CardStatus.mature:
      return matureCardThreshold + (index % 2) // interval >= threshold
    case CardStatus.new:
    default:
      return 0
  }
}
