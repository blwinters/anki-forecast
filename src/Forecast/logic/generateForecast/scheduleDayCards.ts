import { DayCards } from './DayCards'
import { matureCardThreshold } from './forecastHelpers'
import type { AnkiConfig, CardInfo, CardStatusDiff, DayCardsMap } from './types'

interface Props {
  cardsByDay: DayCardsMap //mutated in place with new day indices for each reviewed card
  dayCards: DayCards //DTO with cards to be reviewed for this day
  dayIndex: number
  ankiConfig: AnkiConfig
}

export const scheduleDayCards = ({
  cardsByDay,
  dayCards,
  dayIndex,
  ankiConfig,
}: Props): CardStatusDiff => {
  const { graduatingInterval } = ankiConfig

  let newDiff = 0
  let youngDiff = 0
  let matureDiff = 0

  const { newCards, young, mature } = dayCards.getCardArrays()

  scheduleNewCards({ newCards, cardsByDay, dayIndex, afterInterval: graduatingInterval })
  const { maturationCount } = scheduleReviewCards({
    reviewCards: young.concat(mature),
    cardsByDay,
    dayIndex,
    ankiConfig,
  })

  newDiff -= newCards.length
  youngDiff += newCards.length
  youngDiff -= maturationCount
  matureDiff += maturationCount

  return {
    new: newDiff,
    young: youngDiff,
    mature: matureDiff,
  }
}

interface ScheduleNewProps {
  newCards: CardInfo[]
  cardsByDay: DayCardsMap
  dayIndex: number
  afterInterval: number
}

const scheduleNewCards = ({
  newCards,
  cardsByDay,
  dayIndex,
  afterInterval: interval,
}: ScheduleNewProps) => {
  const updatedNewCards: CardInfo[] = newCards.map(card => ({
    id: card.id,
    latestInterval: interval,
  }))
  const newIndex = dayIndex + interval

  appendToCardsByDayAtIndex(cardsByDay, newIndex, updatedNewCards)
}

interface ScheduleReviewsProps {
  reviewCards: CardInfo[]
  cardsByDay: DayCardsMap
  dayIndex: number
  ankiConfig: AnkiConfig
}

export const scheduleReviewCards = ({
  reviewCards,
  cardsByDay,
  dayIndex,
  ankiConfig,
}: ScheduleReviewsProps) => {
  const { goodMultiplier, maxInterval } = ankiConfig
  let maturationCount = 0

  reviewCards.forEach(card => {
    const newInterval = Math.round(card.latestInterval * goodMultiplier)
    const validatedNewInterval = Math.min(newInterval, maxInterval)
    const newIndex = dayIndex + validatedNewInterval
    if (card.latestInterval < matureCardThreshold && newInterval >= matureCardThreshold) {
      maturationCount += 1
    }

    const newCard: CardInfo = {
      id: card.id,
      latestInterval: newInterval,
    }

    appendToCardsByDayAtIndex(cardsByDay, newIndex, [newCard])
  })

  return {
    maturationCount,
  }
}

const appendToCardsByDayAtIndex = (cardsByDay: DayCardsMap, index: number, cards: CardInfo[]) => {
  const existingAtIndex = cardsByDay.get(index) ?? []
  const combined = existingAtIndex.concat(cards)
  cardsByDay.set(index, combined)
}
