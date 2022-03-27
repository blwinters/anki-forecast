import { BasicConfig } from '../../logic'

export interface BasicConfigAction {
  type: BasicActionType
  payload: {
    value: number
  }
}

type BasicActionType = 'SET_DECK_SIZE' | 'SET_FORECAST_LENGTH' | 'SET_SKIPS_PER_MONTH'

export const basicConfigReducer = (state: BasicConfig, action: BasicConfigAction): BasicConfig => {
  switch (action.type) {
    case 'SET_DECK_SIZE':
      return {
        ...state,
        deckSize: action.payload.value,
      }

    case 'SET_FORECAST_LENGTH':
      return {
        ...state,
        forecastLength: action.payload.value,
      }

    case 'SET_SKIPS_PER_MONTH':
      return {
        ...state,
        skipsPerMonth: action.payload.value,
      }

    default:
      return state
  }
}
