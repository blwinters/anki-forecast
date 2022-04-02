import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import CssBaseline from '@mui/material/CssBaseline'
import { Helmet } from 'react-helmet'
import ReactGA from 'react-ga4'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import App from './App'

ReactGA.initialize(process.env.REACT_APP_GA_ID as string, { legacyDimensionMetric: false })
ReactGA.send('pageview')

ReactDOM.render(
  <StrictMode>
    <Helmet>
      <title>Anki Forecast</title>
      <meta
        name="description"
        content="Generate a forecast of your Anki flashcard reviews for the months ahead, using a range of settings and personal factors."
      />
    </Helmet>
    <CssBaseline />
    <App />
  </StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
