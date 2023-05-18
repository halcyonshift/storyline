import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { Theme } from '@mui/system'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { isBoolean } from 'lodash'
import { changeLanguage } from 'i18next'
import {
    DEFAULT_AUTO_BACKUP_FREQ,
    DEFAULT_AUTO_SAVE,
    DEFAULT_DISPLAY_MODE,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_INDENT_PARAGRAPH,
    DEFAULT_LANGUAGE,
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PALETTE,
    DEFAULT_PARAGRAPH_SPACING,
    DEFAULT_SPELL_CHECK
} from '@sl/constants/defaults'
import { getHex as _getHex } from '@sl/theme/utils'
import { LanguageType } from '@sl/i18n/types'
import { SettingsContextType, FontType, DisplayModeType, ColorType, ShadeType } from './types'

const SettingsContext = createContext({} as SettingsContextType)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const database = useDatabase()
    const [autoBackupFreq, setAutoBackupFreq] = useState<number>(DEFAULT_AUTO_BACKUP_FREQ)
    const [autoBackupPath, setAutoBackupPath] = useState<string>('')
    const [autoSave, setAutoSave] = useState<boolean>(DEFAULT_AUTO_SAVE)
    const [displayMode, setDisplayMode] = useState<DisplayModeType>(DEFAULT_DISPLAY_MODE)
    const [appFont, setAppFont] = useState<FontType>(DEFAULT_FONT)
    const [appFontSize, setAppFontSize] = useState<number>(DEFAULT_FONT_SIZE)
    const [editorFont, setEditorFont] = useState<FontType>(DEFAULT_FONT)
    const [editorFontSize, setEditorFontSize] = useState<number>(DEFAULT_FONT_SIZE)
    const [indentParagraph, setIndentParagraph] = useState<boolean>(DEFAULT_INDENT_PARAGRAPH)
    const [language, setLanguage] = useState<LanguageType>(DEFAULT_LANGUAGE)
    const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>(
        DEFAULT_LINE_HEIGHT
    )
    const [palette, setPalette] = useState<ColorType>(DEFAULT_PALETTE)
    const [paragraphSpacing, setParagraphSpacing] = useState<number>(DEFAULT_PARAGRAPH_SPACING)
    const [spellCheck, setSpellCheck] = useState<boolean>(DEFAULT_SPELL_CHECK)
    const [theme, setTheme] = useState<Theme>(createTheme({}))

    const init = () => {
        database.localStorage
            .get<number>('autoBackupFreq')
            .then((autoBackupFreq) => setAutoBackupFreq(autoBackupFreq || DEFAULT_AUTO_BACKUP_FREQ))
        database.localStorage
            .get<string>('autoBackupPath')
            .then((autoBackupPath) => setAutoBackupPath(autoBackupPath || ''))
        database.localStorage
            .get<boolean>('autoSave')
            .then((autoSave) => setAutoSave(autoSave || DEFAULT_AUTO_SAVE))
        database.localStorage
            .get<DisplayModeType>('displayMode')
            .then((displayMode) => setDisplayMode(displayMode || DEFAULT_DISPLAY_MODE))
        database.localStorage
            .get<FontType>('appFont')
            .then((font) => setAppFont(font || DEFAULT_FONT))
        database.localStorage
            .get<number>('appFontSize')
            .then((fontSize) => setAppFontSize(fontSize || DEFAULT_FONT_SIZE))
        database.localStorage
            .get<FontType>('editorFont')
            .then((font) => setEditorFont(font || DEFAULT_FONT))
        database.localStorage
            .get<number>('editorFontSize')
            .then((fontSize) => setEditorFontSize(fontSize || DEFAULT_FONT_SIZE))
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
            .get<'normal' | 'relaxed' | 'loose'>('lineHeight')
            .then((lineHeight) => setLineHeight(lineHeight || DEFAULT_LINE_HEIGHT))
        database.localStorage
            .get<ColorType>('palette')
            .then((palette) => setPalette(palette || DEFAULT_PALETTE))
        database.localStorage
            .get<number>('paragraphSpacing')
            .then((paragraphSpacing) =>
                setParagraphSpacing(paragraphSpacing || DEFAULT_PARAGRAPH_SPACING)
            )
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        changeLanguage(language)
        database.localStorage.set('autoBackupFreq', autoBackupFreq)
        database.localStorage.set('autoBackupPath', autoBackupPath)
        database.localStorage.set('autoSave', autoSave)
        database.localStorage.set('displayMode', displayMode)
        database.localStorage.set('appFont', appFont)
        database.localStorage.set('appFontSize', appFontSize)
        database.localStorage.set('editorFont', editorFont)
        database.localStorage.set('editorFontSize', editorFontSize)
        database.localStorage.set('indentParagraph', indentParagraph)
        database.localStorage.set('i18nextLng', language).then(() => {
            localStorage.setItem('i18nextLng', language)
        })
        database.localStorage.set('lineHeight', lineHeight)
        database.localStorage.set('palette', palette)
        database.localStorage.set('paragraphSpacing', paragraphSpacing)
        database.localStorage.set('spellCheck', spellCheck)
    }, [
        autoBackupFreq,
        autoBackupPath,
        autoSave,
        displayMode,
        appFont,
        appFontSize,
        editorFont,
        editorFontSize,
        indentParagraph,
        language,
        lineHeight,
        palette,
        paragraphSpacing,
        spellCheck
    ])

    useEffect(() => {
        const _theme = createTheme({
            palette: {
                mode: displayMode,
                contrastThreshold: 4.5,
                primary: {
                    light: getHex(100),
                    main: getHex(500),
                    dark: getHex(900),
                    contrastText: _getHex('white')
                },
                secondary: {
                    light: _getHex('slate', 100),
                    main: _getHex('slate', 500),
                    dark: _getHex('slate', 900),
                    contrastText: _getHex('white')
                },
                error: {
                    light: _getHex('rose', 100),
                    main: _getHex('rose', 500),
                    dark: _getHex('rose', 900),
                    contrastText: _getHex('white')
                },
                warning: {
                    light: _getHex('amber', 100),
                    main: _getHex('amber', 500),
                    dark: _getHex('amber', 900),
                    contrastText: _getHex('white')
                },
                info: {
                    light: _getHex('sky', 100),
                    main: _getHex('sky', 500),
                    dark: _getHex('sky', 900),
                    contrastText: _getHex('white')
                },
                success: {
                    light: _getHex('emerald', 100),
                    main: _getHex('emerald', 500),
                    dark: _getHex('emerald', 900),
                    contrastText: _getHex('white')
                },
                grey: {
                    50: _getHex('slate', 50),
                    100: _getHex('slate', 100),
                    200: _getHex('slate', 200),
                    300: _getHex('slate', 300),
                    400: _getHex('slate', 400),
                    500: _getHex('slate', 500),
                    600: _getHex('slate', 600),
                    700: _getHex('slate', 700),
                    800: _getHex('slate', 800),
                    900: _getHex('slate', 900)
                }
            },
            typography: {
                fontSize: appFontSize,
                fontFamily: appFont
            }
        })
        setTheme(responsiveFontSizes(_theme))
    }, [displayMode, appFont, appFontSize, palette])

    const getHex = (shade?: ShadeType): string => {
        if (!shade) {
            shade = displayMode === 'light' ? 400 : 900
        }

        return _getHex(palette, shade)
    }

    const getHeaderHeight = (): string => {
        return appFontSize > 20 ? 'h-14' : 'h-12'
    }

    const isDark = (): boolean => Boolean(displayMode === 'dark')

    return (
        <SettingsContext.Provider
            value={{
                autoBackupFreq,
                setAutoBackupFreq,
                autoBackupPath,
                setAutoBackupPath,
                autoSave,
                setAutoSave,
                displayMode,
                setDisplayMode,
                appFont,
                setAppFont,
                appFontSize,
                setAppFontSize,
                editorFont,
                setEditorFont,
                editorFontSize,
                setEditorFontSize,
                language,
                setLanguage,
                indentParagraph,
                setIndentParagraph,
                lineHeight,
                setLineHeight,
                palette,
                setPalette,
                paragraphSpacing,
                setParagraphSpacing,
                spellCheck,
                setSpellCheck,
                theme,
                getHex,
                getHeaderHeight,
                isDark
            }}>
            {children}
        </SettingsContext.Provider>
    )
}

const useSettings = () => useContext(SettingsContext)

export default useSettings
