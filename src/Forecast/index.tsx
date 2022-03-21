import React, { useCallback, useState } from 'react'
import Chart from './ui/Chart'
import { DaySummary } from './logic/generateForecast/types'
import { ForecastProps, generateForecast } from './logic/generateForecast'
import ControlPanel from './ui/ControlPanel'

const Forecast = () => {
  const [data, setData] = useState<DaySummary[]>([])

  const onUpdateChart = useCallback((forecastProps: ForecastProps) => {
    const forecast = generateForecast(forecastProps)
    setData(forecast)
  }, [])

  return (
    <>
      <Chart data={data} />
      <ControlPanel onUpdateChart={onUpdateChart} />
    </>
  )
}

export default Forecast
