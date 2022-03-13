import { ReviewCountProps, getDayCards } from './getDayCards'
import { DayCardCounts } from './DayCards'
import { CardStatus, DayCardsMap, DayConfig } from './types'
import { makeCardArray, makeNewCardArray } from './forecastHelpers'

describe('getReviewCounts', () => {
  const defaultDayConfig: DayConfig = { newCards: 30, maxReviews: 200 }
  const defaultCountProps: ReviewCountProps = {
    dayIndex: 0,
    dayConfig: defaultDayConfig,
    cardsByDay: new Map(),
    newCardsRemaining: makeNewCardArray(500),
  }

  describe('card statuses', () => {
    describe('new cards', () => {
      it('limits new cards by total new cards remaining', () => {
        const newCardsRemaining = 12
        const actual = getDayCards({
          ...defaultCountProps,
          newCardsRemaining: makeNewCardArray(newCardsRemaining),
        }).toCounts()
        expect(actual.newCards).toEqual(newCardsRemaining)
      })

      it('limits new cards by day config', () => {
        const dayNewCards = 25
        const actual = getDayCards({
          ...defaultCountProps,
          dayConfig: {
            newCards: dayNewCards,
            maxReviews: 200,
          },
        }).toCounts()
        expect(actual.newCards).toEqual(dayNewCards)
      })
    })

    describe('reviews', () => {
      it('identifies learning cards by interval', () => {
        const learningCount = 9
        const cardsByDay: DayCardsMap = new Map()
        const dayLearningCards = makeCardArray(CardStatus.learning, learningCount)
        cardsByDay.set(0, dayLearningCards)

        const actual = getDayCards({
          ...defaultCountProps,
          cardsByDay,
        }).toCounts()

        expect(actual.learning).toEqual(learningCount)
      })

      it('identifies young cards by interval', () => {
        const youngCount = 11
        const cardsByDay: DayCardsMap = new Map()
        const dayYoungCards = makeCardArray(CardStatus.young, youngCount)
        cardsByDay.set(0, dayYoungCards)

        const actual = getDayCards({
          ...defaultCountProps,
          cardsByDay,
        }).toCounts()

        expect(actual.young).toEqual(youngCount)
      })

      it('identifies mature cards by interval', () => {
        const matureCount = 13
        const cardsByDay: DayCardsMap = new Map()
        const dayMatureCards = makeCardArray(CardStatus.mature, matureCount)
        cardsByDay.set(0, dayMatureCards)

        const actual = getDayCards({
          ...defaultCountProps,
          cardsByDay,
        }).toCounts()

        expect(actual.mature).toEqual(matureCount)
      })

      it('identifies all card statuses in combination', () => {
        const cardsByDay: DayCardsMap = new Map()
        const learningCards = makeCardArray(CardStatus.learning, 15)
        const youngCards = makeCardArray(CardStatus.young, 20)
        const matureCards = makeCardArray(CardStatus.mature, 7)
        const allReviewCards = learningCards.concat(youngCards).concat(matureCards)
        cardsByDay.set(0, allReviewCards)

        const actual = getDayCards({
          ...defaultCountProps,
          cardsByDay,
          dayConfig: {
            maxReviews: 500,
            newCards: 35,
          },
        }).toCounts()

        const expected: DayCardCounts = {
          newCards: 35,
          learning: 15,
          young: 20,
          mature: 7,
          total: 77,
        }

        expect(actual).toEqual(expected)
      })
    })
  })

  describe('max reviews', () => {
    it('limits total reviews', () => {
      const expectedMaxReviews = 200
      const cardsByDay: DayCardsMap = new Map()
      const matureCards = makeCardArray(CardStatus.mature, expectedMaxReviews + 5)
      cardsByDay.set(0, matureCards)
      const actual = getDayCards({
        dayIndex: 0,
        dayConfig: {
          maxReviews: expectedMaxReviews,
          newCards: 30,
        },
        cardsByDay,
        newCardsRemaining: makeNewCardArray(500),
      }).toCounts()
      expect(actual.total).toEqual(expectedMaxReviews)
    })
  })

  describe('prioritization', () => {
    it('fetches interday learning cards first', () => {
      //
    })

    it('fetches young and mature reviews second', () => {
      //
    })
    it('fetches new cards last', () => {
      //
    })
  })
})
