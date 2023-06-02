import { MutableRefObject } from 'react'
import { SectionModel, WorkModel } from '@sl/db/models'

export type ExportModeType = 'docx' | 'epub' | 'html' | 'md' | 'pages' | 'pdf' | 'rtf' | 'txt'
export type StylesType = {
    h1: object
    h2: object
    h3: object
    sep: object
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
    part: string
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

export type FullWorkSectionProps = {
    parts?: SectionModel[]
    chapters?: SectionModel[]
    scenes: SectionModel[]
    settings: ExportDataType
    styles: StylesType | undefined
    parse: (s: string, settings: ExportDataType) => string | JSX.Element | JSX.Element[]
}

export type FullWorkProps = {
    forwardRef: MutableRefObject<HTMLElement>
    settings?: ExportDataType
    styles?: StylesType
    parse?: (value: string, settings?: ExportDataType) => string | JSX.Element | JSX.Element[]
}
