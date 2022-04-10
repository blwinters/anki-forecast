import { createTheme, Box, ThemeProvider, Typography } from '@mui/material'
import { lazy, Suspense, useState } from 'react'
import { Welcome } from './Welcome'

const Forecast = lazy(() => import('./Forecast'))
const theme = createTheme()

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <ThemeProvider theme={theme}>
      {showWelcome && <Welcome onProceed={() => setShowWelcome(false)} />}
      {!showWelcome && (
        <Suspense fallback={<Loading />}>
          <Forecast />
        </Suspense>
      )}
    </ThemeProvider>
  )
}

const Loading = () => (
  <Box display="flex" flexDirection="column" paddingTop="100px" alignItems="center">
    <Typography variant="h4" textAlign="center">
      Loading...
    </Typography>
  </Box>
)

export default App
