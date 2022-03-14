export interface AnkiConfig {
  reviewAccuracy: number
  graduatingInterval: number
  maxInterval: number
  againMultiplier: number
  goodMultiplier: number
  intervalModifier: number
}

export interface DayConfig {
  newCards: number
  maxReviews: number
}

export interface DaySummaryReviews {
  new: number
  young: number
  mature: number
  total: number
  max: number
}

export interface DaySummaryEndCounts {
  young: number
  mature: number
  totalActive: number
  newRemaining: number
}

export interface CardStatusDiff {
  new: number
  young: number
  mature: number
}

export interface DayLearningSummary {
  reviews: DaySummaryReviews
  endCounts: DaySummaryEndCounts
}

export enum CardStatus {
  new,
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
