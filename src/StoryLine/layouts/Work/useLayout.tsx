import { createContext, useContext, useEffect, useState } from 'react'
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

    const updateWidths = async () => {
        setNavigationWidth(navigationRef.current.offsetWidth)
        setPanelWidth(panelRef.current.offsetWidth)
        setMainWidth(mainRef.current.offsetWidth)
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        updateWidths()
        window.addEventListener('resize', updateWidths)
        return () => {
            window.removeEventListener('resize', updateWidths)
        }
    }, [navigationRef.current, panelRef.current, mainRef.current])

    return (
        <LayoutContext.Provider
            value={{
                navigationRef,
                panelRef,
                mainRef,
                windowWidth,
                navigationWidth,
                panelWidth,
                setPanelWidth,
                mainWidth
            }}>
            {children}
        </LayoutContext.Provider>
    )
}

const useLayout = () => useContext(LayoutContext)

export default useLayout
