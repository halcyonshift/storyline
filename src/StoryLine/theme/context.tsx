import { createContext, ReactNode, useEffect, useState } from 'react'
import { orange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { Theme } from '@mui/system'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { isBoolean } from 'lodash'
import { changeLanguage } from 'i18next'
import {
    DEFAULT_AUTO_BACKUP_FREQ,
    DEFAULT_AUTO_BACKUP_MAX,
    DEFAULT_AUTO_SAVE,
    DEFAULT_DISPLAY_MODE,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_INDENT_PARAGRAPH,
    DEFAULT_LANGUAGE,
    DEFAULT_LINE_SPACING,
    DEFAULT_PALETTE,
    DEFAULT_PARAGRAPH_SPACING,
    DEFAULT_SPELL_CHECK
} from '@sl/constants/defaults'
import { colors } from '@sl/theme/utils'
import { LanguageType } from '@sl/i18n/types'
import { SettingsContextType, FontType, DisplayModeType } from './types'

export const SettingsContext = createContext({} as SettingsContextType)

const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const database = useDatabase()
    const [autoBackupFreq, setAutoBackupFreq] = useState<number>(DEFAULT_AUTO_BACKUP_FREQ)
    const [autoBackupMax, setAutoBackupMax] = useState<number>(DEFAULT_AUTO_BACKUP_MAX)
    const [autoSave, setAutoSave] = useState<boolean>(DEFAULT_AUTO_SAVE)
    const [displayMode, setDisplayMode] = useState<DisplayModeType>(DEFAULT_DISPLAY_MODE)
    const [font, setFont] = useState<FontType>(DEFAULT_FONT)
    const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE)
    const [indentParagraph, setIndentParagraph] = useState<boolean>(DEFAULT_INDENT_PARAGRAPH)
    const [language, setLanguage] = useState<LanguageType>(DEFAULT_LANGUAGE)
    const [lineSpacing, setLineSpacing] = useState<number>(DEFAULT_LINE_SPACING)
    const [palette, setPalette] = useState<string>(DEFAULT_PALETTE)
    const [paragraphSpacing, setParagraphSpacing] = useState<number>(DEFAULT_PARAGRAPH_SPACING)
    const [spellCheck, setSpellCheck] = useState<boolean>(DEFAULT_SPELL_CHECK)
    const [theme, setTheme] = useState<Theme>(createTheme({}))

    useEffect(() => {
        database.localStorage
            .get<number>('autoBackupFreq')
            .then((autoBackupFreq) => setAutoBackupFreq(autoBackupFreq || DEFAULT_AUTO_BACKUP_FREQ))
        database.localStorage
            .get<number>('autoBackupMax')
            .then((autoBackupMax) => setAutoBackupMax(autoBackupMax || DEFAULT_AUTO_BACKUP_MAX))
        database.localStorage
            .get<boolean>('autoSave')
            .then((autoSave) => setAutoSave(autoSave || DEFAULT_AUTO_SAVE))
        database.localStorage
            .get<DisplayModeType>('displayMode')
            .then((displayMode) => setDisplayMode(displayMode || DEFAULT_DISPLAY_MODE))
        database.localStorage.get<FontType>('font').then((font) => setFont(font || DEFAULT_FONT))
        database.localStorage
            .get<number>('fontSize')
            .then((fontSize) => setFontSize(fontSize || DEFAULT_FONT_SIZE))
        database.localStorage
            .get<boolean>('indentParagraph')
            .then((indentParagraph) =>
                setIndentParagraph(
                    isBoolean(indentParagraph) ? indentParagraph : DEFAULT_INDENT_PARAGRAPH
                )
            )
        database.localStorage.get<LanguageType>('i18nextLng').then((language) => {
            setLanguage(language || DEFAULT_LANGUAGE)
        })
        database.localStorage
            .get<number>('lineSpacing')
            .then((lineSpacing) => setLineSpacing(lineSpacing || DEFAULT_LINE_SPACING))
        database.localStorage
            .get<string>('palette')
            .then((palette) => setPalette(palette || DEFAULT_PALETTE))
        database.localStorage
            .get<number>('paragraphSpacing')
            .then((paragraphSpacing) =>
                setParagraphSpacing(paragraphSpacing || DEFAULT_PARAGRAPH_SPACING)
            )
    }, [])

    useEffect(() => {
        changeLanguage(language)
        database.localStorage.set('autoBackupFreq', autoBackupFreq)
        database.localStorage.set('autoBackupMax', autoBackupMax)
        database.localStorage.set('autoSave', autoSave)
        database.localStorage.set('displayMode', displayMode)
        database.localStorage.set('font', font)
        database.localStorage.set('fontSize', fontSize)
        database.localStorage.set('indentParagraph', indentParagraph)
        database.localStorage.set('i18nextLng', language).then(() => {
            localStorage.setItem('i18nextLng', language)
        })
        database.localStorage.set('lineSpacing', lineSpacing)
        database.localStorage.set('palette', palette)
        database.localStorage.set('paragraphSpacing', paragraphSpacing)
        database.localStorage.set('spellCheck', spellCheck)
    }, [
        autoBackupFreq,
        autoBackupMax,
        autoSave,
        displayMode,
        font,
        fontSize,
        indentParagraph,
        language,
        lineSpacing,
        palette,
        paragraphSpacing,
        spellCheck
    ])

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

    const getHex = (shade?: number): string => {
        if (!shade) {
            shade = displayMode === 'light' ? 400 : 800
        }
        return colors[palette][shade]
    }

    return (
        <SettingsContext.Provider
            value={{
                autoBackupFreq,
                setAutoBackupFreq,
                autoBackupMax,
                setAutoBackupMax,
                autoSave,
                setAutoSave,
                displayMode,
                setDisplayMode,
                font,
                setFont,
                fontSize,
                setFontSize,
                language,
                setLanguage,
                indentParagraph,
                setIndentParagraph,
                lineSpacing,
                setLineSpacing,
                palette,
                setPalette,
                paragraphSpacing,
                setParagraphSpacing,
                spellCheck,
                setSpellCheck,
                theme,
                getHex
            }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider
