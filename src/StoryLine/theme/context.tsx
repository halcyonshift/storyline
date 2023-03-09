import { createContext, ReactNode, useEffect, useState } from 'react'
import { orange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { Theme } from '@mui/system'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { isBoolean } from 'lodash'
import { changeLanguage } from 'i18next'
import {
    DEFAULT_DISPLAY_MODE,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_LANGUAGE,
    DEFAULT_INDENT_PARAGRAPH
} from '@sl/constants/defaults'
import { LanguageType } from '@sl/i18n/types'
import { SettingsContextType, FontType, DisplayModeType } from './types'

export const SettingsContext = createContext({} as SettingsContextType)

const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const database = useDatabase()

    const [font, setFont] = useState<FontType>(DEFAULT_FONT)
    const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE)
    const [displayMode, setDisplayMode] = useState<DisplayModeType>(DEFAULT_DISPLAY_MODE)
    const [language, setLanguage] = useState<LanguageType>(DEFAULT_LANGUAGE)
    const [indentParagraph, setIndentParagraph] = useState<boolean>(DEFAULT_INDENT_PARAGRAPH)
    const [theme, setTheme] = useState<Theme>(createTheme({}))

    useEffect(() => {
        database.localStorage.get<LanguageType>('i18nextLng').then((language) => {
            setLanguage(language || DEFAULT_LANGUAGE)
        })
        database.localStorage.get<FontType>('font').then((font) => setFont(font || DEFAULT_FONT))
        database.localStorage
            .get<number>('fontSize')
            .then((fontSize) => setFontSize(fontSize || DEFAULT_FONT_SIZE))
        database.localStorage
            .get<DisplayModeType>('displayMode')
            .then((displayMode) => setDisplayMode(displayMode || DEFAULT_DISPLAY_MODE))
        database.localStorage
            .get<boolean>('indentParagraph')
            .then((indentParagraph) =>
                setIndentParagraph(
                    isBoolean(indentParagraph) ? indentParagraph : DEFAULT_INDENT_PARAGRAPH
                )
            )
    }, [])

    useEffect(() => {
        changeLanguage(language)
        database.localStorage.set('i18nextLng', language).then(() => {
            localStorage.setItem('i18nextLng', language)
        })
        database.localStorage.set('displayMode', displayMode)
        database.localStorage.set('font', font)
        database.localStorage.set('fontSize', fontSize)
        database.localStorage.set('indentParagraph', indentParagraph)
    }, [displayMode, font, fontSize, indentParagraph, language])

    useEffect(() => {
        setTheme(
            createTheme({
                palette: {
                    mode: displayMode,
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
    }, [displayMode, font, fontSize])

    return (
        <SettingsContext.Provider
            value={{
                font,
                setFont,
                fontSize,
                setFontSize,
                displayMode,
                setDisplayMode,
                language,
                setLanguage,
                indentParagraph,
                setIndentParagraph,
                theme
            }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider
