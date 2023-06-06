import { ImgHTMLAttributes } from 'react'

export type ImageProps = {
    path: string
    placeholder?: 'generic' | 'character'
} & ImgHTMLAttributes<HTMLImageElement>
