import { AnkiConfig } from '../../logic'

interface BaseAction {
  type: string
}

export type AnkiConfigActionType =
  | 'SET_MAX_INTERVAL'
  | 'SET_GRADUATING_INTERVAL'
  | 'SET_GOOD_MULTIPLIER'

interface SetMaxIntervalAction extends BaseAction {
  type: AnkiConfigActionType
  payload: {
    value: number
  }
}

export type AnkiConfigAction = SetMaxIntervalAction

export const ankiConfigReducer = (state: AnkiConfig, action: AnkiConfigAction): AnkiConfig => {
  const { value } = action.payload

  switch (action.type) {
    case 'SET_MAX_INTERVAL':
      return {
        ...state,
        maxInterval: value,
      }

    case 'SET_GRADUATING_INTERVAL':
      return {
        ...state,
        graduatingInterval: value,
      }

    case 'SET_GOOD_MULTIPLIER':
      return {
        ...state,
        goodMultiplier: value,
      }

    default:
      return state
  }
}
