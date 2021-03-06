import { Box, useTheme } from '@mui/material'
import {
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { DaySummary } from '../../logic'

export interface ChartProps {
  data: DaySummary[]
}

const Chart = ({ data }: ChartProps) => {
  const { breakpoints } = useTheme()
  const chartData = data.map(chartDataMapper)

  return (
    <Box
      sx={{
        height: 500,
        [breakpoints.up('sm')]: {
          height: 700,
        },
      }}>
      <ResponsiveContainer height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 10,
          }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.learnedArea} stopOpacity={0.8} />
              <stop offset="95%" stopColor={theme.learnedArea} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis name="Day" dataKey="name" />
          <YAxis
            yAxisId="left"
            type="number"
            dataKey="totalReviews"
            name="Daily Reviews"
            unit=""
            orientation="left"
            stroke={theme.totalReviews}
          />
          <YAxis
            yAxisId="right"
            type="number"
            dataKey="totalActive"
            name="Total Learned"
            unit=""
            orientation="right"
            stroke={theme.totalLearned}
          />
          <Tooltip labelFormatter={label => `Day ${label as string}`} />
          <Legend />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="totalActive"
            name="Total Learned"
            stroke={theme.learnedArea}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Bar yAxisId="left" dataKey="newReviews" name="New Cards" stackId="a" fill={theme.new} />
          <Bar
            yAxisId="left"
            dataKey="youngReviews"
            name="Young Reviews"
            stackId="a"
            fill={theme.young}
          />
          <Bar
            yAxisId="left"
            dataKey="matureReviews"
            name="Mature Reviews"
            stackId="a"
            fill={theme.mature}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  )
}

interface DataPoint {
  name: string
  newReviews: number
  youngReviews: number
  matureReviews: number
  totalReviews: number
  totalActive: number
}

const chartDataMapper = (summary: DaySummary, index: number): DataPoint => {
  return {
    name: `${index + 1}`,
    newReviews: summary.reviews.new,
    youngReviews: summary.reviews.young,
    matureReviews: summary.reviews.mature,
    totalReviews: summary.reviews.total,
    totalActive: summary.endCounts.totalActive,
  }
}

interface ForecastTheme {
  new: string
  young: string
  mature: string
  learnedArea: string
  totalLearned: string
  totalReviews: string
}

const themeA: ForecastTheme = {
  new: '#fc9967',
  young: '#a4de6c',
  mature: '#83a6ed',
  learnedArea: '#8884d8',
  totalLearned: '#888888',
  totalReviews: '#888888',
}

const theme: ForecastTheme = themeA

export default Chart
