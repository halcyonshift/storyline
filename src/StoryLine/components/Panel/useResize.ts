import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useCallback, useEffect, useState } from 'react'
import useLayout from '@sl/layouts/Work/useLayout'

type UseResizeReturn = {
    width: number
    enableResize: () => void
}

const useResize = (): UseResizeReturn => {
    const database = useDatabase()
    const { windowWidth, navigationWidth, setPanelWidth } = useLayout()
    const [isResizing, setIsResizing] = useState(false)
    const [minWidth, setMinWidth] = useState(Math.round((windowWidth - navigationWidth) / 5))
    const [width, setWidth] = useState(Math.round((windowWidth - navigationWidth) / 5))

    useEffect(() => {
        database.localStorage.get<number>('panelWidth').then((val) => {
            setWidth(val || minWidth)
            setPanelWidth(val || minWidth)
        })
    }, [])

    useEffect(() => {
        setMinWidth(Math.round((windowWidth - navigationWidth) / 5))
    }, [width])

    const enableResize = useCallback(() => {
        setIsResizing(true)
    }, [setIsResizing])

    const disableResize = useCallback(() => {
        setIsResizing(false)
        database.localStorage.set('panelWidth', width)
    }, [setIsResizing, width])

    const resize = useCallback(
        (e: MouseEvent) => {
            if (isResizing) {
                const newWidth =
                    e.clientX - navigationWidth >= minWidth ? e.clientX - navigationWidth : minWidth

                setPanelWidth(newWidth)
                setWidth(newWidth)
            }
        },
        [minWidth, isResizing]
    )

    const updateWidth = () => {
        const newWidth = Math.round(window.innerWidth / 5)
        setPanelWidth(newWidth >= minWidth ? newWidth : minWidth)
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
