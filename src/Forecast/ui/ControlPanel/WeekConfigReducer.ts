import { makeWeekConfigByRepeating, DayOfWeekIndex, WeekConfig } from '../../logic'
import { WeekConfigType } from './WeekConfigPanel'

interface BaseAction {
  type: string
}

interface SetDayNewCardsAction extends BaseAction {
  type: 'SET_DAY_NEW_CARDS'
  payload: {
    dayIndex: DayOfWeekIndex
    value: number
  }
}

interface SetDayMaxReviewsAction extends BaseAction {
  type: 'SET_DAY_MAX_REVIEWS'
  payload: {
    dayIndex: DayOfWeekIndex
    value: number
  }
}

interface SetAllNewCardsAction extends BaseAction {
  type: 'SET_ALL_NEW_CARDS'
  payload: {
    value: number
  }
}

interface SetAllMaxReviewsAction extends BaseAction {
  type: 'SET_ALL_MAX_REVIEWS'
  payload: {
    value: number
  }
}

interface SetWeekConfigTypeAction extends BaseAction {
  type: 'SET_WEEK_CONFIG_TYPE'
  payload: {
    value: WeekConfigType
  }
}

export type WeekConfigAction =
  | SetWeekConfigTypeAction
  | SetDayNewCardsAction
  | SetDayMaxReviewsAction
  | SetAllNewCardsAction
  | SetAllMaxReviewsAction

export interface WeekConfigState {
  selectedType: WeekConfigType
  basic: WeekConfig
  dayOfWeek: WeekConfig
}

export const weekConfigReducer = (
  state: WeekConfigState,
  action: WeekConfigAction
): WeekConfigState => {
  switch (action.type) {
    case 'SET_WEEK_CONFIG_TYPE': {
      const { value } = action.payload
      return {
        ...state,
        selectedType: value,
      }
    }

    case 'SET_ALL_NEW_CARDS': {
      const { value } = action.payload
      const { maxReviews } = state.basic[0]
      const newBasicConfig = makeWeekConfigByRepeating({
        newCards: value,
        maxReviews,
      })

      return {
        ...state,
        basic: newBasicConfig,
      }
    }

    case 'SET_ALL_MAX_REVIEWS': {
      const { value } = action.payload
      const { newCards } = state.basic[0]
      const newBasicConfig = makeWeekConfigByRepeating({
        newCards,
        maxReviews: value,
      })

      return {
        ...state,
        basic: newBasicConfig,
      }
    }

    case 'SET_DAY_NEW_CARDS': {
      const { value, dayIndex } = action.payload
      const { maxReviews } = state.dayOfWeek[dayIndex]

      const newDayOfWeekConfig = Array.from(state.dayOfWeek)
      newDayOfWeekConfig[dayIndex] = { newCards: value, maxReviews }

      return {
        ...state,
        dayOfWeek: newDayOfWeekConfig,
      }
    }

    case 'SET_DAY_MAX_REVIEWS': {
      const { value, dayIndex } = action.payload
      const { newCards } = state.dayOfWeek[dayIndex]

      const newDayOfWeekConfig = Array.from(state.dayOfWeek)
      newDayOfWeekConfig[dayIndex] = { newCards, maxReviews: value }

      return {
        ...state,
        dayOfWeek: newDayOfWeekConfig,
      }
    }

    default:
      return state
  }
}
