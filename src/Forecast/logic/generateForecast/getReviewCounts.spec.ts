import { ReviewCountProps, getReviewCounts, ReviewCounts } from './getReviewCounts'
import { CardInfo, CardStatus, DayCardsMap, DayConfig } from './types'
import { matureCardThreshold } from './forecastHelpers'

describe('getReviewCounts', () => {
  const defaultDayConfig: DayConfig = { newCards: 30, maxReviews: 200 }
  const defaultCountProps: ReviewCountProps = {
    dayIndex: 0,
    dayConfig: defaultDayConfig,
    cardsByDay: new Map(),
    newCardsRemaining: 500,
  }

  describe('card statuses', () => {
    describe('new cards', () => {
      it('limits new cards by total new cards remaining', () => {
        const newCardsRemaining = 12
        const actual = getReviewCounts({
          ...defaultCountProps,
          newCardsRemaining,
        })
        expect(actual.newCards).toEqual(newCardsRemaining)
      })

      it('limits new cards by day config', () => {
        const dayNewCards = 25
        const actual = getReviewCounts({
          ...defaultCountProps,
          dayConfig: {
            newCards: dayNewCards,
            maxReviews: 200,
          },
        })
        expect(actual.newCards).toEqual(dayNewCards)
      })
    })

    describe('reviews', () => {
      it('identifies learning cards by interval', () => {
        const learningCount = 9
        const cardsByDay: DayCardsMap = new Map()
        const dayLearningCards = makeCardArray(CardStatus.learning, learningCount)
        cardsByDay.set(0, dayLearningCards)

        const actual = getReviewCounts({
          ...defaultCountProps,
          cardsByDay,
        })

        expect(actual.learning).toEqual(learningCount)
      })

      it('identifies young cards by interval', () => {
        const youngCount = 11
        const cardsByDay: DayCardsMap = new Map()
        const dayYoungCards = makeCardArray(CardStatus.young, youngCount)
        cardsByDay.set(0, dayYoungCards)

        const actual = getReviewCounts({
          ...defaultCountProps,
          cardsByDay,
        })

        expect(actual.young).toEqual(youngCount)
      })

      it('identifies mature cards by interval', () => {
        const matureCount = 13
        const cardsByDay: DayCardsMap = new Map()
        const dayMatureCards = makeCardArray(CardStatus.mature, matureCount)
        cardsByDay.set(0, dayMatureCards)

        const actual = getReviewCounts({
          ...defaultCountProps,
          cardsByDay,
        })

        expect(actual.mature).toEqual(matureCount)
      })

      it('identifies all card statuses in combination', () => {
        const cardsByDay: DayCardsMap = new Map()
        const learningCards = makeCardArray(CardStatus.learning, 15)
        const youngCards = makeCardArray(CardStatus.young, 20)
        const matureCards = makeCardArray(CardStatus.mature, 7)
        const allReviewCards = learningCards.concat(youngCards).concat(matureCards)
        cardsByDay.set(0, allReviewCards)

        const actual = getReviewCounts({
          ...defaultCountProps,
          cardsByDay,
          dayConfig: {
            maxReviews: 500,
            newCards: 35,
          },
        })

        const expected: ReviewCounts = {
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
      const actual = getReviewCounts({
        dayIndex: 0,
        dayConfig: {
          maxReviews: expectedMaxReviews,
          newCards: 30,
        },
        cardsByDay,
        newCardsRemaining: 500,
      })
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

const makeCardArray = (status: CardStatus, count: number): CardInfo[] => {
  const baseArray = Array.from({ length: count }, () => null)
  return baseArray.map((_, index) => ({
    id: index,
    latestInterval: intervalForIndex(index, status),
  }))
}

const intervalForIndex = (index: number, status: CardStatus): number => {
  switch (status) {
    case CardStatus.learning:
      return 1 / (index + 2)
    case CardStatus.young:
      return 1 + index
    case CardStatus.mature:
      return matureCardThreshold + (index % 2) // interval >= threshold
    default:
      return 0
  }
}
