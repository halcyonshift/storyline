import { Theme } from '@mui/system'
import { LanguageType } from '@sl/i18n/types'

export type FontType = 'arial' | 'roboto' | 'OpenDyslexic' | 'times new roman'
export type DisplayModeType = 'dark' | 'light'

export type SettingsDataType = {
    language: LanguageType
    displayMode: DisplayModeType
    font: FontType
    fontSize: number
    indentParagraph: boolean
    lineSpacing: number
    paragraphSpacing: number
    spellCheck: boolean
    autoSave: boolean
    autoBackupFreq: number
    autoBackupMax: number
    palette: string
}

export type SettingsContextType = {
    setLanguage: (language: LanguageType) => void
    setFont: (font: FontType) => void
    setFontSize: (fontSize: number) => void
    setDisplayMode: (displayMode: DisplayModeType) => void
    setIndentParagraph: (indentParagraph: boolean) => void
    setLineSpacing: (lineSpacing: number) => void
    setParagraphSpacing: (paragraphSpacing: number) => void
    setSpellCheck: (spellCheck: boolean) => void
    setAutoSave: (autoSave: boolean) => void
    setAutoBackupFreq: (autoBackupFreq: number) => void
    setAutoBackupMax: (autoBackupMax: number) => void
    setPalette: (palette: string) => void
    theme: Theme
    getHex: (shade?: number) => string
} & SettingsDataType
