import { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { TabType, TabsContextType, TabsProviderProps } from './types'

export const TabsContext = createContext({} as TabsContextType)

const TabsProvider = ({
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

    const params = useParams()
    const location = useLocation()

    useEffect(() => {
        if (tabs.length) {
            setShowTabs(true)
        } else {
            setShowTabs(false)
        }
    }, [tabs, params, location])

    useEffect(() => {
        if (tabs[active]) {
            loadTab(tabs[active])
        }
    }, [active])

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

        let newIndex = 0

        if (tabIndex > 0) {
            newIndex = tabIndex - 1
        } else if (tabIndex < tabIndex - 1) {
            newIndex = newIndex = tabIndex + 1
        }

        const newTabs = tabs.filter((tab) => tab.id !== id)
        setTabs(newTabs)

        if (newTabs.length) {
            loadTab(newTabs[newIndex])
        } else {
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

export default TabsProvider
