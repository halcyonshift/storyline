import { SectionModel, WorkModel } from '@sl/db/models'

export type ExportModeType = 'docx' | 'epub' | 'html' | 'md' | 'pages' | 'pdf' | 'rtf' | 'txt'
export type StylesType = {
    h1: object
    h2: object
    h3: object
    sep: object
    p: object
    cover: object
    image: object
    page: object
}

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

export type FullWorkSectionType = {
    parts?: SectionModel[]
    chapters?: SectionModel[]
    scenes: SectionModel[]
    settings: ExportDataType
    styles: StylesType
    parse: (s: string) => string
}
