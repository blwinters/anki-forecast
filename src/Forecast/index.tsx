import React from 'react'
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
  const data: DayLearningSummary[] = generateForecast({
    startingSummary: defaultStartingSummary({ deckSize: 2000 }),
    forecastLength: 60,
    ankiConfig: defaultAnkiConfig,
    weekConfig: defaultWeekConfig,
  })

  return (
    <>
      <Chart data={data} />
      <Button variant="contained">Update</Button>
    </>
  )
}

export default Forecast
