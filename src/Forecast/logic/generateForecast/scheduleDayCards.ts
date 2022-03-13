import { DayCards } from './DayCards'
import type { AnkiConfig, CardStatusDiff, DayCardsMap } from './types'

/**
 * @param dayCards   - An object containing the cards fetched for the day's review
 * @param cardsByDay - A map of the cards to be mutated in place with
 *                     new due day indices and intervals for the day's cards
 * @param ankiConfig - Config for adjusting new interval values
 */
export const scheduleDayCards = (
  dayCards: DayCards,
  cardsByDay: DayCardsMap,
  ankiConfig: AnkiConfig
): CardStatusDiff => {
  let statusDiff: CardStatusDiff = {
    new: 0,
    learning: 0,
    young: 0,
    mature: 0,
  }

  return statusDiff
}
