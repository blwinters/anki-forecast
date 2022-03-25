import { AnkiConfig } from '../../logic/generateForecast/types'

interface BaseAction {
  type: string
}

export type AnkiConfigActionType = 'SET_MAX_INTERVAL' | ''

interface SetMaxIntervalAction extends BaseAction {
  type: AnkiConfigActionType
  payload: {
    value: number
  }
}

export type AnkiConfigAction = SetMaxIntervalAction

export const ankiConfigReducer = (state: AnkiConfig, action: AnkiConfigAction): AnkiConfig => {
  switch (action.type) {
    case 'SET_MAX_INTERVAL': {
      const { value } = action.payload
      return {
        ...state,
        maxInterval: value,
      }
    }
    default:
      return state
  }
}
