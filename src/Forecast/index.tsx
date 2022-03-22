import React, { useCallback, useState } from 'react'
import Chart from './ui/Chart'
import { DaySummary } from './logic/generateForecast/types'
import { ForecastProps, generateForecast } from './logic/generateForecast'
import ControlPanel from './ui/ControlPanel'
import { Container, Grid } from '@mui/material'

const Forecast = () => {
  const [data, setData] = useState<DaySummary[]>([])

  const onUpdateChart = useCallback((forecastProps: ForecastProps) => {
    const forecast = generateForecast(forecastProps)
    setData(forecast)
  }, [])

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} p={4}>
        <Grid item xs={10}>
          <Chart data={data} />
        </Grid>
        <Grid item xs={2}>
          <ControlPanel onUpdateChart={onUpdateChart} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Forecast
