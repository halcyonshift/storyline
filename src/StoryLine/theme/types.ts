import { Theme } from '@mui/system'
import { LanguageType } from '@sl/i18n/types'

export type FontType = 'arial' | 'roboto' | 'OpenDyslexic' | 'times new roman'
export type DisplayModeType = 'dark' | 'light'
export type ColorType =
    | 'black'
    | 'white'
    | 'slate'
    | 'gray'
    | 'zinc'
    | 'neutral'
    | 'stone'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuschia'
    | 'pink'
    | 'rose'

export type ShadeType = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
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
    palette: ColorType
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
    setPalette: (palette: ColorType) => void
    theme: Theme
    getHex: (shade?: ShadeType) => string
} & SettingsDataType
