export type ImageType = {
    path: string
    title?: string
    subtitle?: string
}

export type GalleryProps = {
    images: ImageType[]
    layout?: 'horizontal' | 'vertical'
}
