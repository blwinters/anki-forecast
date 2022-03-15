import { DayCards } from '../DayCards'
import { defaultAnkiConfig, makeNewCardArray, makeCardArray } from '../forecastHelpers'
import { scheduleDayCards } from '../scheduleDayCards'
import { getDayCards } from '../getDayCards'
import { AnkiConfig, CardStatus, DayCardsMap, DayConfig } from '../types'

describe('scheduleDayCards', () => {
  const youngCardCount = 20
  const matureCardCount = 10
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

  it('schedules young and mature cards with goodMultiplier', () => {
    dayIndex = 2
    dayConfig = {
      newCards: 0, //no new cards for this test
      maxReviews: 200,
    }
    ankiConfig = {
      ...defaultAnkiConfig,
      reviewAccuracy: 1,
      goodMultiplier: 2.7,
    }

    const youngIntervalA = 1
    const youngIntervalB = 9
    const matureIntervalA = 21
    const matureIntervalB = 40

    const youngCardsA = makeCardArray(CardStatus.young, youngCardCount / 2, youngIntervalA)
    const youngCardsB = makeCardArray(CardStatus.young, youngCardCount / 2, youngIntervalB)
    const matureCardsA = makeCardArray(CardStatus.mature, matureCardCount / 2, matureIntervalA)
    const matureCardsB = makeCardArray(CardStatus.mature, matureCardCount / 2, matureIntervalB)

    const allCardsForToday = youngCardsA
      .concat(youngCardsB)
      .concat(matureCardsA)
      .concat(matureCardsB)

    cardsByDay.set(dayIndex, allCardsForToday)

    populateDayCards()
    const cardStatusDiff = scheduleDayCards({ dayIndex, dayCards, cardsByDay, ankiConfig })
    expect(cardStatusDiff.young).toBe(-10)
    expect(cardStatusDiff.mature).toBe(10)

    const expectedYoungIndexA = 5
    const expectedYoungIndexB = 26
    const expectedMatureIndexA = 59
    const expectedMatureIndexB = 110

    const youngDayCardsA = cardsByDay.get(expectedYoungIndexA) ?? []
    const youngDayCardsB = cardsByDay.get(expectedYoungIndexB) ?? []
    const matureDayCardsA = cardsByDay.get(expectedMatureIndexA) ?? []
    const matureDayCardsB = cardsByDay.get(expectedMatureIndexB) ?? []

    expect(youngDayCardsA).toHaveLength(10)
    expect(youngDayCardsB).toHaveLength(10)
    expect(matureDayCardsA).toHaveLength(5)
    expect(matureDayCardsB).toHaveLength(5)
  })

})
