import { expose } from 'comlink'
import { ForecastProps, generateForecast } from '../generateForecast'

export default {} as typeof Worker & { new (): Worker }

console.log('[ForecastWorker] Running.')

export const api = {
  generateForecast: (propsString: string): string => {
    const props = JSON.parse(propsString) as ForecastProps
    const result = generateForecast(props)
    return JSON.stringify(result)
  },
}

expose(api)
