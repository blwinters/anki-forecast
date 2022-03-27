import { CardIdArrays, DayCardArrays, DayCards } from '../DayCards'
import { makeCardArray, makeNewCardArray } from '../forecastHelpers'
import { CardStatus } from '../types'

describe('DayCards', () => {
  it('returns ids by status', () => {
    const input: DayCardArrays = {
      newCards: makeNewCardArray(10),
      young: makeCardArray(CardStatus.young, 10),
      mature: makeCardArray(CardStatus.mature, 10),
    }

    const newIds = input.newCards.map(card => card.id)
    const youngIds = input.young.map(card => card.id)
    const matureIds = input.mature.map(card => card.id)
    const expected: CardIdArrays = {
      newIds,
      youngIds,
      matureIds,
    }

    const actual = new DayCards(input).getCardIdsByStatus()
    expect(actual).toEqual(expected)
  })
})
