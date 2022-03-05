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
    learning: number
    max: number
  }
}
// youngReviews: number
// matureReviews: number
// youngCards: number
// matureCards: number
// totalActiveCards: number

// 0 = Monday
export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const defaultLearnDays: DayOfWeekIndex[] = [0, 1, 2, 3, 4, 5, 6]
export const defaultReviewDays: DayOfWeekIndex[] = [0, 1, 2, 3, 4, 5, 6]

export type WeekConfig = DayConfig[]

export const makeWeekConfigByRepeating = (dayConfig: DayConfig): WeekConfig => {
  return Array.from({ length: 7 }, () => dayConfig)
}

export const defaultDayConfig: DayConfig = {
  newCards: 50,
  maxReviews: 500,
}

export const defaultWeekConfig: WeekConfig = makeWeekConfigByRepeating(defaultDayConfig)

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
