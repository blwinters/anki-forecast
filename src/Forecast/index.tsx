import React, { useCallback, useState } from 'react'
import { Button } from '@mui/material'
import Chart from './ui/Chart'
import { DayLearningSummary } from './logic/generateForecast/types'
import { generateForecast } from './logic/generateForecast'
import {
  defaultAnkiConfig,
  defaultStartingSummary,
  defaultWeekConfig,
} from './logic/generateForecast/forecastHelpers'

const Forecast = () => {
  const [data, setData] = useState<DayLearningSummary[]>([])

  const onUpdate = useCallback(() => {
    const forecast = generateForecast({
      startingSummary: defaultStartingSummary({ deckSize: 2000 }),
      forecastLength: 60,
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
