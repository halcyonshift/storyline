import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Outlet } from 'react-router-dom'
import { useSettings } from '@sl/theme'

const App = () => {
    const settings = useSettings()

    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={settings.theme}>
                <CssBaseline />
                <Box className={`${settings.displayMode} flex h-full`}>
                    <Outlet />
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

export default App
