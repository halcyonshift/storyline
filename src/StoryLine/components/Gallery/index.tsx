import { useEffect, useState, SyntheticEvent } from 'react'
import {
    Backdrop,
    Box,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Stack
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import useLayout from '@sl/layouts/Work/useLayout'
import Image from '../Image'
import { GalleryProps } from './types'

const Gallery = ({ images, layout }: GalleryProps) => {
    const [index, setIndex] = useState<number>(0)
    const [open, setOpen] = useState<boolean>(false)
    const [imageHeight, setImageHeight] = useState<number>(0)
    const { panelWidth, navigationWidth, windowWidth } = useLayout()
    const { t } = useTranslation()

    const nextImage = (e: SyntheticEvent) => {
        e.stopPropagation()
        setIndex(index + 1 === images.length ? 0 : index + 1)
    }

    const lastImage = (e: SyntheticEvent) => {
        e.stopPropagation()
        setIndex(index - 1 < 0 ? images.length - 1 : index - 1)
    }

    useEffect(() => {
        if (layout === 'vertical') {
            setImageHeight(Math.round((windowWidth - panelWidth - navigationWidth) / 3 / 3))
        } else {
            setImageHeight(
                Math.round((windowWidth - panelWidth - navigationWidth) / 2 / 3) -
                    images.length * 3 -
                    3
            )
        }
    }, [panelWidth, navigationWidth, windowWidth])

    if (!images.length) return <></>

    return (
        <Box>
            <Backdrop className='z-10' open={open} onClick={() => setOpen(false)}>
                <Stack direction='row' className='w-[80%]' alignItems='center'>
                    {images.length > 1 ? (
                        <IconButton
                            aria-label={t('component.gallery.back')}
                            onClick={lastImage}
                            className='text-white'>
                            {GLOBAL_ICONS.back}
                        </IconButton>
                    ) : null}
                    <Box className='flex-grow'>
                        <Image path={images[index].path} className='mx-auto'></Image>
                    </Box>
                    {images.length > 1 ? (
                        <IconButton
                            aria-label={t('component.gallery.next')}
                            onClick={nextImage}
                            className='text-white'>
                            {GLOBAL_ICONS.next}
                        </IconButton>
                    ) : null}
                </Stack>
            </Backdrop>
            <Box className={layout === 'vertical' ? '' : 'grid gap-1 grid-cols-2'}>
                <Image path={images[index].path} onClick={() => setOpen(true)}></Image>
                <Box>
                    <ImageList cols={3} className={layout == 'vertical' ? 'my-1' : ''}>
                        {images.map((image, i) => (
                            <ImageListItem key={`image-${image.path}`} onClick={() => setIndex(i)}>
                                <Image
                                    path={`${image.path}`}
                                    alt={image.title}
                                    style={{
                                        height: imageHeight,
                                        objectFit: 'cover'
                                    }}
                                />
                                {image.title ? (
                                    <ImageListItemBar
                                        title={image.title}
                                        subtitle={image.subtitle}
                                    />
                                ) : null}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </Box>
        </Box>
    )
}

export default Gallery
