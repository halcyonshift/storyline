import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useCallback, useEffect, useState } from 'react'
import useLayout from '@sl/layouts/Work/useLayout'
import useSettings from '@sl/theme/useSettings'
import { UseResize } from './types'

const MIN_WIDTH = 200
const DIV_MAX_WIDTH = 2.5
const DIV_MIN_WIDTH = 5

const useResize = (): UseResize => {
    const database = useDatabase()
    const settings = useSettings()
    const { windowWidth, navigationWidth, setPanelWidth } = useLayout()
    const [isResizing, setIsResizing] = useState<boolean>(false)
    const [maxWidth, setMaxWidth] = useState<number>(
        Math.round((windowWidth - navigationWidth) / DIV_MAX_WIDTH)
    )
    const [width, setWidth] = useState<number>(
        Math.round((windowWidth - navigationWidth) / DIV_MIN_WIDTH)
    )

    useEffect(() => {
        database.localStorage.get<number>('panelWidth').then((val) => {
            if (val && val >= MIN_WIDTH && val <= maxWidth) {
                setWidth(val)
                setPanelWidth(val)
            }
        })
    }, [])

    useEffect(() => {
        const _maxWidth = Math.round((windowWidth - navigationWidth) / DIV_MAX_WIDTH)
        setMaxWidth(_maxWidth)
        let newWidth = Math.round((windowWidth - navigationWidth) / DIV_MIN_WIDTH)
        if (newWidth < MIN_WIDTH) {
            newWidth = MIN_WIDTH
        } else if (newWidth > _maxWidth) {
            newWidth = _maxWidth
        }
        if (width < newWidth || width > _maxWidth) {
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
                const newWidth = e.clientX - navigationWidth
                if (newWidth >= MIN_WIDTH && newWidth <= maxWidth) {
                    setPanelWidth(newWidth)
                    setWidth(newWidth)
                }
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
