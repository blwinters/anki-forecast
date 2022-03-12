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

export interface DayLearningSummary {
  reviews: {
    new: number
    learning: number
    young: number
    mature: number
    total: number
    max: number
  }
  endingCards: {
    learning: number
    young: number
    mature: number
    totalActive: number
    newRemaining: number
  }
}

export enum CardStatus {
  new,
  learning,
  young,
  mature,
}

export type DaySummaryMap = Map<number, DayLearningSummary>
export type DayCardsMap = Map<number, CardInfo[]>

export interface CardInfo {
  id: number
  latestInterval: number
}

// 0 = Monday
export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const defaultLearnDays: DayOfWeekIndex[] = [0, 1, 2, 3, 4, 5, 6]
export const defaultReviewDays: DayOfWeekIndex[] = [0, 1, 2, 3, 4, 5, 6]

export type WeekConfig = DayConfig[]
