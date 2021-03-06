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
      <Grid
        container
        spacing={3}
        sx={{
          paddingX: {
            xs: 0,
            sm: 4,
          },
          paddingY: {
            xs: 1,
            sm: 4,
          },
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}>
        <Grid item xs={12} sm={10}>
          <Chart data={data} />
        </Grid>
        <Grid item xs={8} sm={2}>
          <Container>
            <ControlPanel onUpdateChart={onUpdateChart} />
          </Container>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Forecast
