import { Theme } from '@mui/system'
import { LanguageType } from '@sl/i18n/types'

export type FontType = 'arial' | 'roboto' | 'open-dyslexic' | 'times new roman'
export type DisplayModeType = 'dark' | 'light'

export type SettingsDataType = {
    language: LanguageType
    displayMode: DisplayModeType
    font: FontType
    fontSize: number
    indentParagraph: boolean
}

export type SettingsContextType = {
    setLanguage: (language: LanguageType) => void
    setFont: (font: FontType) => void
    setFontSize: (fontSize: number) => void
    setDisplayMode: (displayMode: DisplayModeType) => void
    setIndentParagraph: (indentParagraph: boolean) => void
    theme: Theme
} & SettingsDataType
