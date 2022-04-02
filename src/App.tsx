import { useState } from 'react'
import Forecast from './Forecast'
import { Welcome } from './Welcome'

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <>
      {showWelcome && <Welcome onProceed={() => setShowWelcome(false)} />}
      {!showWelcome && <Forecast />}
    </>
  )
}

export default App
