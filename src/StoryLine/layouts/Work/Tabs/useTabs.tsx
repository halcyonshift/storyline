import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TabType, TabsContextType, TabsProviderProps } from '../types'

const TabsContext = createContext({} as TabsContextType)

export const TabsProvider = ({
    children,
    characters,
    items,
    locations,
    notes,
    sections,
    work
}: TabsProviderProps) => {
    const [tabs, setTabs] = useState<TabType[]>([])
    const [active, setActive] = useState<number>()
    const [showTabs, setShowTabs] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (tabs[active]) {
            loadTab(tabs[active])
        }
    }, [active])

    useEffect(() => {
        if (!tabs.length) {
            setShowTabs(false)
        }
    }, [tabs.length])

    const loadTab = (focusTab: TabType) => {
        const focus = tabs.findIndex((tab) => tab.id === focusTab.id)
        if (focus === -1) {
            setTabs(tabs.concat([focusTab]))
            setActive(tabs.length)
        } else {
            setActive(focus)
        }

        navigate(`/works/${work.id}/${focusTab.link}`)
    }

    const removeTab = (id: string) => {
        const tabIndex = tabs.findIndex((tab) => tab.id === id)

        if (tabs[tabIndex + 1]) {
            loadTab(tabs[tabIndex + 1])
        } else if (tabs[tabIndex - 1]) {
            loadTab(tabs[tabIndex - 1])
        }

        const newTabs = tabs.filter((tab) => tab.id !== id)
        setTabs(newTabs)

        if (!newTabs.length) {
            navigate(`/works/${work.id}`)
        }
    }

    return (
        <TabsContext.Provider
            value={{
                active,
                setActive,
                tabs,
                setTabs,
                loadTab,
                removeTab,
                showTabs,
                setShowTabs,
                characters,
                items,
                locations,
                notes,
                sections,
                work
            }}>
            {children}
        </TabsContext.Provider>
    )
}

const useTabs = () => useContext(TabsContext)

export default useTabs
