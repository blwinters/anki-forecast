import { AnkiConfig, WeekConfig, DayLearningInfo } from './types'

interface Props {
  ankiConfig: AnkiConfig
  weekConfig: WeekConfig
  forecastLength: number
}

export const generateForecast = ({
  ankiConfig,
  weekConfig,
  forecastLength,
}: Props): DayLearningInfo[] => {
  return Array.from({ length: forecastLength }, (_, i): DayLearningInfo => {
    const weekdayIndex = i % 7
    return {
      cards: {
        new: weekConfig[weekdayIndex].newCards,
      },
      reviews: {
        max: weekConfig[weekdayIndex].maxReviews,
      },
    }
  })
}
