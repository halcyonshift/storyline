import { useEffect, useState } from 'react'
import { ImageProps } from './types'

import { generic, character } from './placeholder'

const Image = ({ path, alt, placeholder = 'generic', ...props }: ImageProps) => {
    const [src, setSrc] = useState<string | null>()
    const [placeholderSrc] = useState<string>(placeholder === 'generic' ? generic : character)

    useEffect(() => {
        if (!path) {
            setSrc(placeholderSrc)
        } else {
            api.imageSrc(path).then((img) => setSrc(img || placeholderSrc))
        }
    }, [path])

    return src ? <img alt={alt || ''} src={src} {...props} className='m-auto' /> : <></>
}

export default Image
