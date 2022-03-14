import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { DaySummary } from '../../logic/generateForecast/types'

export interface ChartProps {
  data: DaySummary[]
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
      <Bar dataKey="totalActive" name="Total Reviews" stackId="a" fill="#8884d8" />
    </BarChart>
  )
}

interface DataPoint {
  name: string
  newReviews: number
  totalReviews: number
  totalActive: number
}

const mapDataForChart = (data: DaySummary[]): DataPoint[] => {
  return data.map((summary, index) => {
    return {
      name: `${index + 1}`,
      newReviews: summary.reviews.new,
      totalReviews: summary.reviews.total,
      totalActive: summary.endCounts.totalActive,
    }
  })
}

export default Chart
