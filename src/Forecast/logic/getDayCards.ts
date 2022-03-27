import type { DayConfig, DayCardsMap } from './types'
import { CardStatus } from './types'
import { DayCards, DayCardArrays } from './DayCards'
import { matureCardThreshold } from './forecastHelpers'
import { Card } from './models/Card'

export interface ReviewCountProps {
  dayIndex: number
  dayConfig: DayConfig
  cardsByDay: DayCardsMap
  newCardsRemaining: Card[]
}

export const getDayCards = (cardCountProps: ReviewCountProps): DayCards => {
  const newCards = startingReviewsForStatus(CardStatus.new, cardCountProps)
  const young = startingReviewsForStatus(CardStatus.young, cardCountProps)
  const mature = startingReviewsForStatus(CardStatus.mature, cardCountProps)
  const revisedCardArrays: DayCardArrays = cardsRespectingMaxReviews(
    {
      newCards,
      young,
      mature,
    },
    cardCountProps.dayConfig.maxReviews
  )

  return new DayCards(revisedCardArrays)
}

export const startingReviewsForStatus = (
  status: CardStatus,
  { dayIndex, dayConfig, cardsByDay, newCardsRemaining }: ReviewCountProps
): Card[] => {
  const dueCards: Card[] = cardsByDay.get(dayIndex) ?? []

  switch (status) {
    case CardStatus.new:
      return newCardsRemaining.slice(0, dayConfig.newCards)
    case CardStatus.young:
      return dueCards.filter(card => {
        return card.latestInterval >= 1 && card.latestInterval < matureCardThreshold
      })
    case CardStatus.mature:
      return dueCards.filter(card => {
        return card.latestInterval >= matureCardThreshold
      })
    default:
      throw new Error(`Unknown CardStatus`)
  }
}

const cardsRespectingMaxReviews = (
  originalCards: DayCardArrays,
  maxReviews: number
): DayCardArrays => {
  const { newCards, young, mature } = originalCards

  const revised: DayCardArrays = {
    newCards: [],
    young: [],
    mature: [],
  }

  const sliceFittingAvailableSpace = (cards: Card[]): Card[] => {
    const currentTotal = revised.newCards.length + revised.young.length + revised.mature.length

    const availableSpace = maxReviews - currentTotal
    return cards.slice(0, availableSpace)
  }

  revised.young = sliceFittingAvailableSpace(young)
  revised.mature = sliceFittingAvailableSpace(mature)
  revised.newCards = sliceFittingAvailableSpace(newCards)

  return revised
}
