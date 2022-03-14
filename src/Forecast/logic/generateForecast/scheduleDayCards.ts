import { DayCards } from './DayCards'
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
  const learningDiff = 0
  let youngDiff = 0
  const matureDiff = 0

  const { newCards } = dayCards.getCardArrays()
  const { youngIds, matureIds } = dayCards.getCardIdsByStatus()

  newDiff -= newCards.length
  youngDiff += newCards.length

  scheduleNewCards({ newCards, cardsByDay, dayIndex, graduatingInterval })

  return {
    new: newDiff,
    learning: learningDiff,
    young: youngDiff,
    mature: matureDiff,
  }
}

interface ScheduleNewProps {
  newCards: CardInfo[]
  cardsByDay: DayCardsMap
  dayIndex: number
  graduatingInterval: number
}
const scheduleNewCards = ({
  newCards,
  cardsByDay,
  dayIndex,
  graduatingInterval,
}: ScheduleNewProps) => {
  const updatedNewCards: CardInfo[] = newCards.map(card => ({
    id: card.id,
    latestInterval: graduatingInterval,
  }))
  const newIndex = dayIndex + graduatingInterval

  appendToCardsByDayAtIndex(cardsByDay, newIndex, updatedNewCards)
}

const appendToCardsByDayAtIndex = (cardsByDay: DayCardsMap, index: number, cards: CardInfo[]) => {
  const existingAtIndex = cardsByDay.get(index) ?? []
  const combined = existingAtIndex.concat(cards)
  cardsByDay.set(index, combined)
}
