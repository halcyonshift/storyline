/**
 * eslint-disable @typescript-eslint/import/export
 *
 * @format
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { useDisplay } from '../../src/StoryLine/ui/hooks/theme'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    const display = useDisplay()
    return <ThemeProvider theme={display.theme}>{children}</ThemeProvider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
