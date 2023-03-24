import { createContext, useContext, useEffect, useState } from 'react'
import { LayoutContextType, LayoutProviderProps } from './types'

const LayoutContext = createContext({} as LayoutContextType)

export const LayoutProvider = ({
    navigationRef,
    panelRef,
    mainRef,
    children
}: LayoutProviderProps) => {
    const [navigation, setNavigation] = useState<number>(0)
    const [panel, setPanel] = useState<number>(0)
    const [main, setMain] = useState<number>(0)
    const [width, setWidth] = useState<number>(window.innerWidth)

    const updateWidths = () => {
        setNavigation(navigationRef.current.offsetWidth)
        setPanel(panelRef.current.offsetWidth)
        setMain(mainRef.current.offsetWidth)
        setWidth(window.innerWidth)
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
                width,
                navigation,
                panel,
                setPanel,
                main
            }}>
            {children}
        </LayoutContext.Provider>
    )
}

const useLayout = () => useContext(LayoutContext)

export default useLayout
