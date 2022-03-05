export interface AnkiConfig {
  baseLearningReviews: number
  learningAccuracy: number
  reviewAccuracy: number
  graduatingInterval: number
  maxInterval: number
  againMultiplier: number
  hardMultiplier: number
  goodMultiplier: number
  easyBonus: number
  intervalModifier: number
}

export interface DayConfig {
  newCards: number
  maxReviews: number
}

export interface DayLearningInfo {
  cards: {
    new: number
  }
  reviews: {
    max: number
  }
}
// learningReviews: number
// youngReviews: number
// matureReviews: number
// youngCards: number
// matureCards: number
// totalActiveCards: number

export type WeekdayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7
export const defaultLearnDays: WeekdayNumber[] = [1, 2, 3, 4, 5, 6, 7]
export const defaultReviewDays: WeekdayNumber[] = [1, 2, 3, 4, 5, 6, 7]

export const defaultDayConfig: DayConfig = {
  newCards: 50,
  maxReviews: 500,
}

export type WeekConfig = DayConfig[]
export const defaultWeekConfig: WeekConfig = [
  defaultDayConfig,
  defaultDayConfig,
  defaultDayConfig,
  defaultDayConfig,
  defaultDayConfig,
  defaultDayConfig,
  defaultDayConfig,
]

export const defaultAnkiConfig: AnkiConfig = {
  baseLearningReviews: 2,
  learningAccuracy: 0.5,
  reviewAccuracy: 0.9,
  graduatingInterval: 1,
  maxInterval: 15,
  againMultiplier: 0,
  goodMultiplier: 2.5,
  hardMultiplier: 1.2,
  easyBonus: 1.3,
  intervalModifier: 0.01,
}
