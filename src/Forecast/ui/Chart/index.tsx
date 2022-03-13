import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { DayLearningSummary } from '../../logic/generateForecast/types'

export interface ChartProps {
  data: DayLearningSummary[]
}

const Chart = ({ data }: ChartProps) => {
  const chartData = mapDataForChart(data)

  return (
    <BarChart
      width={800}
      height={500}
      data={chartData}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}>
      <XAxis name="Day" dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalReviews" name="Total Reviews" stackId="a" fill="#8884d8" />
    </BarChart>
  )
}

interface DataPoint {
  name: string
  newReviews: number
  totalReviews: number
}

const mapDataForChart = (data: DayLearningSummary[]): DataPoint[] => {
  return data.map((summary, index) => {
    return {
      name: `${index + 1}`,
      newReviews: summary.reviews.new,
      totalReviews: summary.reviews.total,
    }
  })
}

export default Chart
