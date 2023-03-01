/**
 * eslint-disable @typescript-eslint/import/export
 *
 * @format
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import theme from '../../src/StoryLine/ui/theme'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme.light}>{children}</ThemeProvider>
)

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
