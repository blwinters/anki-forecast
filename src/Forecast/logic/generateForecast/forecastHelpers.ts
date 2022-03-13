import type { DayLearningSummary, DayConfig, WeekConfig, AnkiConfig, CardInfo } from './types'
import { CardStatus } from './types'

export const makeWeekConfigByRepeating = (dayConfig: DayConfig): WeekConfig => {
  return Array.from({ length: 7 }, () => dayConfig)
}

export const defaultDayConfig: DayConfig = {
  newCards: 20,
  maxReviews: 200,
}

export const defaultWeekConfig: WeekConfig = makeWeekConfigByRepeating(defaultDayConfig)

export const matureCardThreshold = 21

export const defaultAnkiConfig: AnkiConfig = {
  learningAccuracy: 0.5,
  reviewAccuracy: 0.9,
  baseLearningReviews: 2, //learning steps
  graduatingInterval: 1,
  maxInterval: 180, //default is 36,500
  againMultiplier: 0, //new interval
  goodMultiplier: 2.5, //starting ease
  hardMultiplier: 1.2, //hard interval
  easyBonus: 1.3,
  intervalModifier: 1.0,
}

export const defaultStartingSummary = (deckSize: number): DayLearningSummary => ({
  reviews: {
    new: 0,
    learning: 0,
    young: 0,
    mature: 0,
    max: 0,
    total: 0,
  },
  endCounts: {
    learning: 0,
    young: 0,
    mature: 0,
    totalActive: 0,
    newRemaining: deckSize,
  },
})

export const makeNewCardArray = (length: number) => {
  return makeCardArray(CardStatus.new, length)
}

export const makeCardArray = (status: CardStatus, length: number): CardInfo[] => {
  const baseArray = Array.from({ length: length }, () => null)
  return baseArray.map((_, index) => ({
    id: index,
    latestInterval: intervalForIndex(index, status),
  }))
}

const intervalForIndex = (index: number, status: CardStatus): number => {
  switch (status) {
    case CardStatus.learning:
      return 1 / (index + 2)
    case CardStatus.young:
      return 1 + index
    case CardStatus.mature:
      return matureCardThreshold + (index % 2) // interval >= threshold
    case CardStatus.new:
    default:
      return 0
  }
}
