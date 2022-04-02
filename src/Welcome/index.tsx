import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'

interface Props {
  onProceed: () => void
}

export const Welcome = ({ onProceed }: Props) => (
  <Container style={{ marginTop: 100 }}>
    <Paper sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <StackItem>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Welcome to Anki Forecast
          </Typography>
        </StackItem>
        <StackItem>
          <Typography variant="body1" sx={{ maxWidth: 680, textAlign: 'center' }}>
            Anki Forecast is a tool for calculating your future flash card reviews and total
            progress. You can use the basic settings, change them by day of the week, or skip a
            certain number of days per month. Several of the Anki deck options are also available
            for tuning your forecast.
          </Typography>
        </StackItem>
        <StackItem>
          <Button variant="contained" onClick={onProceed}>
            Get Started
          </Button>
        </StackItem>
      </Stack>
    </Paper>
  </Container>
)

const StackItem = ({ children }: { children: JSX.Element }) => (
  <Box display="flex" justifyContent="center">
    {children}
  </Box>
)
