import type { CardInfo, DaySummaryReviews } from './types'

export interface DayCardCounts {
  newCards: number
  young: number
  mature: number
  total: number
}

export interface DayCardArrays {
  newCards: CardInfo[]
  young: CardInfo[]
  mature: CardInfo[]
}

export class DayCards {
  private readonly cardArrays: DayCardArrays

  constructor(cardArrays: DayCardArrays) {
    this.cardArrays = cardArrays
  }

  getCardArrays(): DayCardArrays {
    return this.cardArrays
  }

  toCounts(): DayCardCounts {
    const { newCards, young, mature } = this.cardArrays
    return {
      newCards: newCards.length,
      young: young.length,
      mature: mature.length,
      total: newCards.length + young.length + mature.length,
    }
  }

  getDaySummaryReviews(weekdayMax: number): DaySummaryReviews {
    const { newCards, young, mature, total } = this.toCounts()
    return {
      new: newCards,
      young,
      mature,
      total,
      max: weekdayMax,
    }
  }
}
