import type { DayConfig, DayCardsMap } from './types'
import { CardStatus } from './types'
import { matureCardThreshold } from './forecastHelpers'

export interface ReviewCountProps {
  dayIndex: number
  dayConfig: DayConfig
  cardsByDay: DayCardsMap
  newCardsRemaining: number
}

export interface ReviewCounts {
  newCards: number
  learning: number
  young: number
  mature: number
  total: number
}

export const getDayCards = (cardCountProps: ReviewCountProps): ReviewCounts => {
  const newCards = startingReviewsForStatus(CardStatus.new, cardCountProps)
  const learning = startingReviewsForStatus(CardStatus.learning, cardCountProps)
  const young = startingReviewsForStatus(CardStatus.young, cardCountProps)
  const mature = startingReviewsForStatus(CardStatus.mature, cardCountProps)
  return countsRespectingMaxReviews(
    {
      newCards,
      learning,
      young,
      mature,
      total: newCards + learning + young + mature,
    },
    cardCountProps.dayConfig.maxReviews
  )
}

const startingReviewsForStatus = (
  status: CardStatus,
  { dayIndex, dayConfig, cardsByDay, newCardsRemaining }: ReviewCountProps
): number => {
  const dueCards = cardsByDay.get(dayIndex) ?? []

  switch (status) {
    case CardStatus.new:
      return Math.min(dayConfig.newCards, newCardsRemaining)
    case CardStatus.learning:
      const learningCards = dueCards.filter(card => {
        return card.latestInterval > 0 && card.latestInterval < 1
      })
      return learningCards.length
    case CardStatus.young:
      const youngCards = dueCards.filter(card => {
        return card.latestInterval >= 1 && card.latestInterval < matureCardThreshold
      })
      return youngCards.length
    case CardStatus.mature:
      const matureCards = dueCards.filter(card => {
        return card.latestInterval >= matureCardThreshold
      })
      return matureCards.length
    default:
      return 0
  }
}

const countsRespectingMaxReviews = (rawCounts: ReviewCounts, maxReviews: number): ReviewCounts => {
  const { newCards, learning, young, mature, total } = rawCounts

  let revised: ReviewCounts = {
    newCards: 0,
    learning: 0,
    young: 0,
    mature: 0,
    total: 0,
  }

  const checkTotal = () => {
    const currentTotal = revised.newCards + revised.learning + revised.young + revised.mature
    return {
      total: currentTotal,
      spaceAvailable: maxReviews - currentTotal,
    }
  }

  if (newCards > 0) {
    const { spaceAvailable } = checkTotal()
    revised.newCards = Math.min(newCards, spaceAvailable)
  }

  if (learning > 0) {
    const { spaceAvailable } = checkTotal()
    revised.learning = Math.min(learning, spaceAvailable)
  }

  if (young > 0) {
    const { spaceAvailable } = checkTotal()
    revised.young = Math.min(young, spaceAvailable)
  }

  if (mature > 0) {
    const { spaceAvailable } = checkTotal()
    revised.mature = Math.min(mature, spaceAvailable)
  }

  const { total: finalTotal } = checkTotal()
  revised.total = finalTotal

  return revised
}
