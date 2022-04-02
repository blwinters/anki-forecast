import { wrap } from 'comlink'
import { Container, Grid } from '@mui/material'
import { useCallback, useState } from 'react'

import { DaySummary, ForecastProps } from './logic'
import ForecastWorker, { api } from './logic/worker/ForecastWorker.worker'
import { ControlPanel, Chart } from './ui'

const forecastWorker: Worker = new ForecastWorker()
const workerApi = wrap<typeof api>(forecastWorker)

const Forecast = () => {
  const [data, setData] = useState<DaySummary[]>([])

  const onUpdateChart = useCallback((forecastProps: ForecastProps) => {
    const stringifiedProps = JSON.stringify(forecastProps)
    void workerApi
      .generateForecast(stringifiedProps)
      .then((message: string): void => {
        const forecast = JSON.parse(message) as DaySummary[]
        setData(forecast)
      })
      .catch(console.warn)
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
