import React from 'react'

import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Outlet } from 'react-router-dom'


import theme from './theme'


const Main = () => (
    <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <CssBaseline />
            <Container disableGutters maxWidth={false} className='h-[100vh]'>
                <Typography variant='h1' className='text-center'>Supp</Typography>
                <Outlet />
            </Container>
        </LocalizationProvider>
    </ThemeProvider>
)

export default Main