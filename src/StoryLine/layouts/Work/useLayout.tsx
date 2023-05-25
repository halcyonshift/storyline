import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LayoutContextType, LayoutProviderProps } from './types'

const LayoutContext = createContext({} as LayoutContextType)

export const LayoutProvider = ({
    navigationRef,
    panelRef,
    mainRef,
    children
}: LayoutProviderProps) => {
    const [navigationWidth, setNavigationWidth] = useState<number>(0)
    const [panelWidth, setPanelWidth] = useState<number>(0)
    const [mainWidth, setMainWidth] = useState<number>(0)
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

    const updateWidths = async (): Promise<void> => {
        setNavigationWidth(navigationRef.current ? navigationRef.current.offsetWidth : 0)
        setPanelWidth(panelRef.current ? panelRef.current.offsetWidth : 0)
        setMainWidth(mainRef.current ? mainRef.current.offsetWidth : 0)
        setWindowWidth(window.innerWidth || 0)
    }

    useEffect(() => {
        void updateWidths()
        window.addEventListener('resize', updateWidths)
        return () => {
            window.removeEventListener('resize', updateWidths)
        }
    }, [navigationRef.current, panelRef.current, mainRef.current])

    return (
        <LayoutContext.Provider
            value={useMemo(
                () => ({
                    navigationRef,
                    panelRef,
                    mainRef,
                    windowWidth,
                    navigationWidth,
                    panelWidth,
                    setPanelWidth,
                    mainWidth
                }),
                [
                    navigationRef,
                    panelRef,
                    mainRef,
                    windowWidth,
                    navigationWidth,
                    panelWidth,
                    mainWidth
                ]
            )}>
            {children}
        </LayoutContext.Provider>
    )
}

const useLayout = () => useContext(LayoutContext)

export default useLayout
