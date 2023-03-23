/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTheme, ThemeProvider } from '@mui/material/styles'

declare module '@mui/material/styles' {
    interface Palette {
        neutral?: Palette['primary']
    }

    interface PaletteOptions {
        neutral?: PaletteOptions['primary']
    }
}
