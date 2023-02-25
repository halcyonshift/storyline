import React from 'react'

import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Outlet } from 'react-router-dom'

import theme from './ui/theme'


const App = () => (
    <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <CssBaseline />
            <Container disableGutters maxWidth={false} className='h-[100vh]'>
                <Outlet />
            </Container>
        </LocalizationProvider>
    </ThemeProvider>
)

export default App