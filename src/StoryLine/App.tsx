import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Outlet } from 'react-router-dom'
import { useDisplay } from '@sl/theme'

const App = () => {
    const display = useDisplay()

    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={display.theme}>
                <CssBaseline />
                <Box className={`${display.mode} flex h-full`}>
                    <Outlet />
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

export default App
