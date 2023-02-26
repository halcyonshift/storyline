/** @format */

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Outlet } from 'react-router-dom'

import { useColorMode } from './ui/display/colorMode'
import theme from './ui/theme'

const App = () => {
    const colorMode = useColorMode()

    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={theme[colorMode.mode]}>
                <CssBaseline />
                <Box className={`${colorMode.mode} flex h-full`}>
                    <Outlet />
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

export default App
