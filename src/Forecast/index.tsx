import { useCallback, useState } from 'react'
import { DaySummary, ForecastProps, generateForecast } from './logic'
import { ControlPanel, Chart } from './ui'
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
