import { ReactElement, ReactNode, useRef } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import database from '@sl/db'
import '@sl/i18n'
import { MessengerProvider } from '@sl/layouts/useMessenger'
import { LayoutProvider } from '@sl/layouts/Work/useLayout'
import { SettingsProvider } from '@sl/theme/useSettings'

const AllTheProviders = ({ children }: { children: ReactNode }) => {
    const theme = createTheme({})
    const navigationRef = useRef<HTMLElement>()
    const panelRef = useRef<HTMLElement>()
    const mainRef = useRef<HTMLElement>()

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <DatabaseProvider database={database}>
                    <SettingsProvider>
                        <LayoutProvider
                            navigationRef={navigationRef}
                            panelRef={panelRef}
                            mainRef={mainRef}>
                            <MessengerProvider>
                                <BrowserRouter>{children}</BrowserRouter>
                            </MessengerProvider>
                        </LayoutProvider>
                    </SettingsProvider>
                </DatabaseProvider>
            </LocalizationProvider>
        </ThemeProvider>
    )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
