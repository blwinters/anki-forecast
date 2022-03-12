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
    young: number
    mature: number
    totalActive: number
  }
  reviews: {
    learning: number
    young: number
    mature: number
    max: number
  }
}

export type DayInfoMap = Map<number, DayLearningInfo>
export type CardMap = Map<number, CardInfo>

export interface CardInfo {
  dueIndex: number
  latestInterval: number
}

// 0 = Monday
export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const defaultLearnDays: DayOfWeekIndex[] = [0, 1, 2, 3, 4, 5, 6]
export const defaultReviewDays: DayOfWeekIndex[] = [0, 1, 2, 3, 4, 5, 6]

export type WeekConfig = DayConfig[]

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
