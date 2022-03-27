import { BasicConfig } from '../../logic'

export interface BasicConfigAction {
  type: BasicActionType
  payload: {
    value: number
  }
}

type BasicActionType = 'SET_DECK_SIZE' | 'SET_FORECAST_LENGTH'

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

    default:
      return state
  }
}
