import type { DayConfig, DayCardsMap } from './types'
import { CardStatus } from './types'
import { matureCardThreshold } from './forecastHelpers'

export const getReviewCounts = (cardCountProps: CardCountProps) => {
  return {
    newReviews: startingReviewsForStatus(CardStatus.new, cardCountProps),
    learningReviews: startingReviewsForStatus(CardStatus.learning, cardCountProps),
    youngReviews: startingReviewsForStatus(CardStatus.young, cardCountProps),
    matureReviews: startingReviewsForStatus(CardStatus.mature, cardCountProps),
  }
}

interface CardCountProps {
  dayIndex: number
  dayConfig: DayConfig
  cardsByDay: DayCardsMap
  newCardsRemaining: number
}

const startingReviewsForStatus = (
  status: CardStatus,
  { dayIndex, dayConfig, cardsByDay, newCardsRemaining }: CardCountProps
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
