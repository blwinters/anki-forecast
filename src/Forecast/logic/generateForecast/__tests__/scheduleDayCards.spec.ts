import { DayCards } from '../DayCards'
import { defaultAnkiConfig, makeNewCardArray } from '../forecastHelpers'
import { scheduleDayCards } from '../scheduleDayCards'
import { getDayCards } from '../getDayCards'
import { AnkiConfig, DayCardsMap, DayConfig } from '../types'

describe('scheduleDayCards', () => {
  let dayIndex: number
  let cardsByDay: DayCardsMap
  let dayCards: DayCards
  let dayConfig: DayConfig
  let deckSize: number
  let ankiConfig: AnkiConfig

  const populateDayCards = () => {
    dayCards = getDayCards({
      dayIndex: dayIndex,
      dayConfig: dayConfig,
      cardsByDay,
      newCardsRemaining: makeNewCardArray(deckSize),
    })
  }

  beforeEach(() => {
    dayIndex = 0
    deckSize = 500
    dayConfig = {
      maxReviews: 200,
      newCards: 30,
    }
    ankiConfig = defaultAnkiConfig
    cardsByDay = new Map()
  })

  it('schedules new cards with graduating interval', () => {
    const graduatingInterval = 3
    ankiConfig = {
      ...defaultAnkiConfig,
      graduatingInterval,
    }

    populateDayCards()
    const countToLearn = dayConfig.newCards
    const { newCards, young } = dayCards.getCardArrays()
    expect(newCards).toHaveLength(countToLearn)
    expect(young).toHaveLength(0)

    const cardStatusDiff = scheduleDayCards({ dayIndex, dayCards, cardsByDay, ankiConfig })

    expect(cardStatusDiff.new).toEqual(-countToLearn)
    expect(cardStatusDiff.young).toEqual(countToLearn)

    const todayCards = cardsByDay.get(dayIndex) ?? []
    const graduatedDayCards = cardsByDay.get(dayIndex + graduatingInterval) ?? []
    expect(todayCards).toHaveLength(0)
    expect(graduatedDayCards).toHaveLength(dayConfig.newCards)
  })
})
