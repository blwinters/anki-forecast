import React, { useCallback, useState } from 'react'
import { Button } from '@mui/material'
import Chart from './ui/Chart'
import { DaySummary } from './logic/generateForecast/types'
import { generateForecast } from './logic/generateForecast'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  defaultWeekConfig,
} from './logic/generateForecast/forecastHelpers'

const Forecast = () => {
  const [data, setData] = useState<DaySummary[]>([])

  const onUpdate = useCallback(() => {
    const startingSummary = defaultStartingSummary({ deckSize: 2000 })
    const forecast = generateForecast({
      startingSummary,
      forecastLength: 180,
      ankiConfig: defaultAnkiConfig,
      weekConfig: defaultWeekConfig,
    })
    setData(forecast)
  }, [])

  return (
    <>
      <Chart data={data} />
      <Button variant="contained" onClick={onUpdate}>
        Update
      </Button>
    </>
  )
}

export default Forecast
