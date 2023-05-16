import { useEffect, useState } from 'react'
import { ImageProps } from './types'

const Image = ({ path, alt, ...props }: ImageProps) => {
    const [src, setSrc] = useState<string | null>()

    useEffect(() => {
        if (!path) {
            setSrc(null)
        } else {
            api.imageSrc(path).then((img) => setSrc(img))
        }
    }, [path])

    return src ? <img alt={alt || ''} src={src} {...props} /> : <></>
}

export default Image
