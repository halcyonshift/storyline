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
    | 'fuchsia'
    | 'pink'
    | 'rose'

export type ShadeType = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type SettingsDataType = {
    language: LanguageType
    displayMode: DisplayModeType
    appFont: FontType
    appFontSize: number
    editorFont: FontType
    editorFontSize: number
    indentParagraph: boolean
    lineHeight: 'normal' | 'relaxed' | 'loose'
    paragraphSpacing: number
    spellCheck: boolean
    autoSave: boolean
    autoBackupFreq: number
    autoBackupPath: string
    palette: ColorType
}

export type SettingsContextType = {
    setLanguage: (language: LanguageType) => void
    setAppFont: (font: FontType) => void
    setAppFontSize: (fontSize: number) => void
    setEditorFont: (font: FontType) => void
    setEditorFontSize: (fontSize: number) => void
    setDisplayMode: (displayMode: DisplayModeType) => void
    setIndentParagraph: (indentParagraph: boolean) => void
    setLineHeight: (lineHeight: 'normal' | 'relaxed' | 'loose') => void
    setParagraphSpacing: (paragraphSpacing: number) => void
    setSpellCheck: (spellCheck: boolean) => void
    setAutoSave: (autoSave: boolean) => void
    setAutoBackupFreq: (autoBackupFreq: number) => void
    setAutoBackupPath: (autoBackupPath: string) => void
    setPalette: (palette: ColorType) => void
    theme: Theme
    getHex: (shade?: ShadeType) => string
    getHeaderHeight: () => string
} & SettingsDataType

export type StatusMapType = {
    [key: string]: 'error' | 'warning' | 'info' | 'success' | 'secondary'
}
