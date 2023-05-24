import { WorkModel } from '@sl/db/models'

export type ExportModeType = 'docx' | 'epub' | 'html' | 'md' | 'pages' | 'pdf' | 'rtf' | 'txt'

export type ExportFormProps = {
    mode: ExportModeType
    work?: WorkModel
    generateExport: (settings: ExportDataType) => Promise<void>
    open: boolean
    setOpen: (state: boolean) => void
    showFormatting: boolean
    isGenerating: boolean
}

export type ExportDataType = {
    chapterTitle: string
    chapterPosition: 'center'
    author: string
    sceneSeparator: string
    lineHeight: string
    paragraphSpacing: number
    indentParagraph: boolean
    font: string
    fontSize: number
}
