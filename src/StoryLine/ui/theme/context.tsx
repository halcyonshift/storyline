import { createContext, ReactNode, useEffect, useState } from 'react'
import { orange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { Theme } from '@mui/system'
import { useDatabase } from '@nozbe/watermelondb/hooks'

import { fontType, modeType } from './types'

export const DisplayContext = createContext(
    {} as {
        font: fontType
        setFont: (font: fontType) => void
        fontSize: number
        setFontSize: (fontSize: number) => void
        mode: modeType
        setMode: (mode: modeType) => void
        theme: Theme
    }
)

const DisplayProvider = ({ children }: { children: ReactNode }) => {
    const database = useDatabase()

    const [font, setFont] = useState<fontType>('roboto')
    const [fontSize, setFontSize] = useState<number>(12)
    const [mode, setMode] = useState<modeType>('light')
    const [theme, setTheme] = useState<Theme>(createTheme({}))

    useEffect(() => {
        void database.localStorage.get<fontType>('font').then((font) => setFont(font || 'roboto'))
        void database.localStorage
            .get<number>('fontSize')
            .then((fontSize) => setFontSize(fontSize || 12))
        void database.localStorage.get<modeType>('mode').then((mode) => setMode(mode || 'light'))
    }, [])

    useEffect(() => {
        setTheme(
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#1976d2'
                    }
                },
                status: {
                    danger: orange[500]
                },
                typography: {
                    fontSize,
                    fontFamily: font
                }
            })
        )
    }, [font, fontSize, mode])

    return (
        <DisplayContext.Provider
            value={{
                font,
                setFont,
                fontSize,
                setFontSize,
                mode,
                setMode,
                theme
            }}>
            {children}
        </DisplayContext.Provider>
    )
}

export default DisplayProvider
