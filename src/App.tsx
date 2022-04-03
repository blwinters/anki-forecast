import { Box, Typography } from '@mui/material'
import { lazy, Suspense, useState } from 'react'
import { Welcome } from './Welcome'

const Forecast = lazy(() => import('./Forecast'))

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <>
      {showWelcome && <Welcome onProceed={() => setShowWelcome(false)} />}
      {!showWelcome && (
        <Suspense fallback={<Loading />}>
          <Forecast />
        </Suspense>
      )}
    </>
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
