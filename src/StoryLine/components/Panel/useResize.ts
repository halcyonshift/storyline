import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useCallback, useEffect, useState } from 'react'
import useLayout from '@sl/layouts/Work/useLayout'
import useSettings from '@sl/theme/useSettings'
import { UseResize } from './types'

const MIN_WIDTH = 200
const DIV_WIDTH = 5

const useResize = (): UseResize => {
    const database = useDatabase()
    const settings = useSettings()
    const { windowWidth, navigationWidth, setPanelWidth } = useLayout()
    const [isResizing, setIsResizing] = useState(false)
    const [width, setWidth] = useState(Math.round((windowWidth - navigationWidth) / DIV_WIDTH))

    useEffect(() => {
        database.localStorage.get<number>('panelWidth').then((val) => {
            setWidth(val || MIN_WIDTH)
            setPanelWidth(val || MIN_WIDTH)
        })
    }, [])

    useEffect(() => {
        let newWidth = Math.round((windowWidth - navigationWidth) / DIV_WIDTH)
        if (newWidth < MIN_WIDTH) {
            newWidth = MIN_WIDTH
        }
        if (width < newWidth) {
            setWidth(newWidth)
        }
    }, [windowWidth, settings.fontSize])

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
                    e.clientX - navigationWidth >= MIN_WIDTH
                        ? e.clientX - navigationWidth
                        : MIN_WIDTH

                setPanelWidth(newWidth)
                setWidth(newWidth)
            }
        },
        [isResizing]
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
