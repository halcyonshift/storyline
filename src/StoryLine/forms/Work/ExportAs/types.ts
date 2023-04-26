import { ReactElement } from 'react'
import { WorkModel } from '@sl/db/models'

export type ExportAsFormProps = {
    work?: WorkModel
    isGenerating: boolean
    generateExport: (settings: ExportAsDataType) => Promise<void>
}

export type ExportAsDataType = {
    chapterTitle: string
    chapterPosition: 'center'
    author: string
    sceneSeparator: string
    lineHeight: string
    paragraphSpacing: number
    font: string
    fontSize: number
    mode: ExportModeType
}

export type ExportModeType = 'html' | 'pdf' | 'docx'
export type ExportModeTypes = {
    mode: ExportModeType
    icon: ReactElement
}
