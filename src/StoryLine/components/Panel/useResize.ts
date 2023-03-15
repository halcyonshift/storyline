import { useCallback, useEffect, useState } from 'react'

type UseResizeProps = {
    minWidth: number
    offSet?: number
}

type UseResizeReturn = {
    width: number
    enableResize: () => void
}

const useResize = ({ minWidth, offSet }: UseResizeProps): UseResizeReturn => {
    const [isResizing, setIsResizing] = useState(false)
    const [width, setWidth] = useState(minWidth)

    const enableResize = useCallback(() => {
        setIsResizing(true)
    }, [setIsResizing])

    const disableResize = useCallback(() => {
        setIsResizing(false)
    }, [setIsResizing])

    const resize = useCallback(
        (e: MouseEvent) => {
            if (isResizing) {
                const newWidth = e.clientX - (offSet || 0)
                setWidth(newWidth >= minWidth ? newWidth : minWidth)
            }
        },
        [minWidth, isResizing, setWidth]
    )

    const updateWidth = () => {
        const newWidth = Math.round(window.innerWidth / 5)
        setWidth(newWidth >= minWidth ? newWidth : minWidth)
    }

    useEffect(() => {
        document.addEventListener('mousemove', resize)
        document.addEventListener('mouseup', disableResize)
        window.addEventListener('resize', updateWidth)
        return () => {
            document.removeEventListener('mousemove', resize)
            document.removeEventListener('mouseup', disableResize)
            window.removeEventListener('resize', updateWidth)
        }
    }, [disableResize, resize])

    return { width, enableResize }
}

export default useResize
