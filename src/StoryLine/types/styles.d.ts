/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    createTheme,
    ThemeProvider
} from '@mui/material/styles'


declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string
        }
    }
    interface ThemeOptions {
        status?: {
            danger?: string
        }
    }
}