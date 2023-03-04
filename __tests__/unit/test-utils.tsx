import { ReactElement, ReactNode } from 'react'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const AllTheProviders = ({ children }: { children: ReactNode }) => {
    const theme = createTheme({})
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <BrowserRouter>{children}</BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
