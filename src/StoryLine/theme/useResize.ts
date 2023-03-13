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
                if (newWidth >= minWidth) {
                    setWidth(newWidth)
                }
            }
        },
        [minWidth, isResizing, setWidth]
    )

    useEffect(() => {
        document.addEventListener('mousemove', resize)
        document.addEventListener('mouseup', disableResize)

        return () => {
            document.removeEventListener('mousemove', resize)
            document.removeEventListener('mouseup', disableResize)
        }
    }, [disableResize, resize])

    return { width, enableResize }
}

export default useResize
