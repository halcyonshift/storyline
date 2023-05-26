import { CSSProperties } from 'react'
import { ExportDataType, StylesType } from '@sl/forms/Work/Export/types'

const DEFAULT_ALIGN = 'center'
const DEFAULT_FONT = 'arial'
const DEFAULT_HEIGHT = '842px'
const DEFAULT_WIDTH = '595px'

// eslint-disable-next-line complexity
const getStyles = (settings: ExportDataType, overrides?: Partial<StylesType>) => ({
    ...{
        h1: {
            textAlign: DEFAULT_ALIGN,
            fontFamily: settings?.font || DEFAULT_FONT
        } as CSSProperties,
        h2: {
            textAlign: settings?.chapterPosition || DEFAULT_ALIGN,
            fontFamily: settings?.font || DEFAULT_FONT
        } as CSSProperties,
        h3: {
            textAlign: DEFAULT_ALIGN,
            fontFamily: settings?.font || DEFAULT_FONT
        } as CSSProperties,
        sep: {
            textAlign: DEFAULT_ALIGN,
            fontFamily: settings?.font || DEFAULT_FONT
        } as CSSProperties,
        cover: {
            margin: '0 auto',
            height: 'auto',
            width: DEFAULT_WIDTH,
            textAlign: DEFAULT_ALIGN
        } as CSSProperties,
        image: { maxWidth: DEFAULT_WIDTH, maxHeight: DEFAULT_HEIGHT } as CSSProperties,
        page: { width: DEFAULT_WIDTH, margin: 'auto' } as CSSProperties
    },
    ...(overrides || {})
})

export default getStyles
