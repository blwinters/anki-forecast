import type { CardInfo, DaySummaryReviews } from './types'

export interface DayCardCounts {
  newCards: number
  learning: number
  young: number
  mature: number
  total: number
}

export interface DayCardArrays {
  newCards: CardInfo[]
  learning: CardInfo[]
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

  getCardIdsByStatus() {
    return {
      newIds: this.cardArrays.newCards.map(card => card.id),
      learningIds: this.cardArrays.learning.map(card => card.id),
      youngIds: this.cardArrays.young.map(card => card.id),
      matureIds: this.cardArrays.mature.map(card => card.id),
    }
  }

  toCounts(): DayCardCounts {
    const { newCards, learning, young, mature } = this.cardArrays
    return {
      newCards: newCards.length,
      learning: learning.length,
      young: young.length,
      mature: mature.length,
      total: newCards.length + learning.length + young.length + mature.length,
    }
  }

  getDaySummaryReviews(weekdayMax: number): DaySummaryReviews {
    const { newCards, learning, young, mature, total } = this.toCounts()
    return {
      new: newCards,
      learning,
      young,
      mature,
      total,
      max: weekdayMax,
    }
  }
}
