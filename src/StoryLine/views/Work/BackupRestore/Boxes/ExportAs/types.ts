import { ReactElement } from 'react'

export type ExportModeType = 'html' | 'pdf' | 'doc'
export type ExportModeTypes = {
    mode: ExportModeType
    icon: ReactElement
}
