import { ReviewCountProps, getDayCards, startingReviewsForStatus } from '../getDayCards'
import { DayCardCounts } from '../DayCards'
import { CardStatus, DayCardsMap, DayConfig } from '../types'
import { makeCardArray, makeNewCardArray } from '../forecastHelpers'

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
        const youngCards = makeCardArray(CardStatus.young, 20)
        const matureCards = makeCardArray(CardStatus.mature, 7)
        const allReviewCards = youngCards.concat(matureCards)
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
          young: 20,
          mature: 7,
          total: 62,
        }

        expect(actual).toEqual(expected)
      })
    })

    describe('startingReviewsForStatus', () => {
      it('throws error for unknown status value', () => {
        expect(() => {
          startingReviewsForStatus(-1, defaultCountProps)
        }).toThrow()
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
    let cardCountProps: ReviewCountProps

    const youngCards = makeCardArray(CardStatus.young, 20)
    const matureCards = makeCardArray(CardStatus.mature, 20)

    beforeEach(() => {
      const dayIndex = 5
      const cardsByDay = new Map()
      cardsByDay.set(dayIndex, youngCards.concat(matureCards))
      cardCountProps = {
        dayIndex,
        dayConfig: defaultDayConfig,
        cardsByDay,
        newCardsRemaining: makeNewCardArray(100),
      }
    })

    it('fetches young reviews first', () => {
      const props: ReviewCountProps = {
        ...cardCountProps,
        dayConfig: {
          maxReviews: 10,
          newCards: 20,
        },
      }
      const { young, mature, newCards } = getDayCards(props).toCounts()
      expect(young).toBe(10)
      expect(mature).toBe(0)
      expect(newCards).toBe(0)
    })

    it('fetches mature reviews second', () => {
      const props: ReviewCountProps = {
        ...cardCountProps,
        dayConfig: {
          maxReviews: 35,
          newCards: 20,
        },
      }
      const { young, mature, newCards } = getDayCards(props).toCounts()
      expect(young).toBe(20)
      expect(mature).toBe(15)
      expect(newCards).toBe(0)
    })

    it('fetches new cards last', () => {
      const props: ReviewCountProps = {
        ...cardCountProps,
        dayConfig: {
          maxReviews: 57,
          newCards: 20,
        },
      }
      const { young, mature, newCards } = getDayCards(props).toCounts()
      expect(young).toBe(20)
      expect(mature).toBe(20)
      expect(newCards).toBe(17)
    })
  })
})
