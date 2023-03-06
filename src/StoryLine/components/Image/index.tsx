import { ImgHTMLAttributes, useEffect, useState } from 'react'

const Image = ({ path, ...props }: { path: string } & ImgHTMLAttributes<HTMLImageElement>) => {
    const [src, setSrc] = useState<string | null>()

    useEffect(() => {
        if (!path) {
            setSrc(null)
        } else {
            api.imageSrc(path).then((img) => setSrc(img))
        }
    }, [path])

    return src ? <img src={src} {...props} /> : <></>
}

export default Image
