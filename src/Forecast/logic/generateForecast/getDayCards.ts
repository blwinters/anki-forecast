import type { DayConfig, DayCardsMap, CardInfo } from './types'
import { CardStatus } from './types'
import { DayCards, DayCardArrays } from './DayCards'
import { matureCardThreshold } from './forecastHelpers'

export interface ReviewCountProps {
  dayIndex: number
  dayConfig: DayConfig
  cardsByDay: DayCardsMap
  newCardsRemaining: CardInfo[]
}

export const getDayCards = (cardCountProps: ReviewCountProps): DayCards => {
  const newCards = startingReviewsForStatus(CardStatus.new, cardCountProps)
  const learning = startingReviewsForStatus(CardStatus.learning, cardCountProps)
  const young = startingReviewsForStatus(CardStatus.young, cardCountProps)
  const mature = startingReviewsForStatus(CardStatus.mature, cardCountProps)
  const revisedCardArrays: DayCardArrays = cardsRespectingMaxReviews(
    {
      newCards,
      learning,
      young,
      mature,
    },
    cardCountProps.dayConfig.maxReviews
  )

  return new DayCards(revisedCardArrays)
}

const startingReviewsForStatus = (
  status: CardStatus,
  { dayIndex, dayConfig, cardsByDay, newCardsRemaining }: ReviewCountProps
): CardInfo[] => {
  const dueCards = cardsByDay.get(dayIndex) ?? []

  switch (status) {
    case CardStatus.new:
      return newCardsRemaining.slice(0, dayConfig.newCards)
    case CardStatus.learning:
      return dueCards.filter(card => {
        return card.latestInterval > 0 && card.latestInterval < 1
      })
    case CardStatus.young:
      return dueCards.filter(card => {
        return card.latestInterval >= 1 && card.latestInterval < matureCardThreshold
      })
    case CardStatus.mature:
      return dueCards.filter(card => {
        return card.latestInterval >= matureCardThreshold
      })
    default:
      return []
  }
}

const cardsRespectingMaxReviews = (
  originalCards: DayCardArrays,
  maxReviews: number
): DayCardArrays => {
  const { newCards, learning, young, mature } = originalCards

  const revised: DayCardArrays = {
    newCards: [],
    learning: [],
    young: [],
    mature: [],
  }

  const sliceFittingAvailableSpace = (cards: CardInfo[]): CardInfo[] => {
    const currentTotal =
      revised.newCards.length +
      revised.learning.length +
      revised.young.length +
      revised.mature.length

    const availableSpace = maxReviews - currentTotal
    return cards.slice(0, availableSpace)
  }

  revised.newCards = sliceFittingAvailableSpace(newCards)
  revised.learning = sliceFittingAvailableSpace(learning)
  revised.young = sliceFittingAvailableSpace(young)
  revised.mature = sliceFittingAvailableSpace(mature)

  return revised
}
