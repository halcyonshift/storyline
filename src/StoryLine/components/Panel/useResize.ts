import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useCallback, useEffect, useState } from 'react'
import useLayout from '@sl/layouts/Work/useLayout'

type UseResizeProps = {
    minWidth: number
    offSet?: number
    name?: string
}

type UseResizeReturn = {
    width: number
    enableResize: () => void
}

const useResize = ({ minWidth, offSet, name }: UseResizeProps): UseResizeReturn => {
    const database = useDatabase()
    const { setPanel } = useLayout()
    const [isResizing, setIsResizing] = useState(false)
    const [width, setWidth] = useState(minWidth)

    useEffect(() => {
        if (name) {
            database.localStorage.get<number>(name).then((val) => {
                setPanel(val || minWidth)
                setWidth(val || minWidth)
            })
        }
    }, [])

    const enableResize = useCallback(() => {
        setIsResizing(true)
    }, [setIsResizing])

    const disableResize = useCallback(() => {
        setIsResizing(false)
        if (name) database.localStorage.set(name, width)
    }, [setIsResizing, width])

    const resize = useCallback(
        (e: MouseEvent) => {
            if (isResizing) {
                const newWidth = e.clientX - (offSet || 0)
                setWidth(newWidth >= minWidth ? newWidth : minWidth)
                setPanel(newWidth >= minWidth ? newWidth : minWidth)
            }
        },
        [minWidth, isResizing, setWidth]
    )

    const updateWidth = () => {
        const newWidth = Math.round(window.innerWidth / 5)
        setWidth(newWidth >= minWidth ? newWidth : minWidth)
        setPanel(newWidth >= minWidth ? newWidth : minWidth)
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
