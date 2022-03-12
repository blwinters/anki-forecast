import type { DayConfig, WeekConfig, AnkiConfig } from './types'

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
