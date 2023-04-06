import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TabType, TabsContextType, TabsProviderProps } from '../types'

const TabsContext = createContext({} as TabsContextType)

export const TabsProvider = ({ children }: TabsProviderProps) => {
    const [tabs, setTabs] = useState<TabType[]>([])
    const [active, setActive] = useState<number>()
    const [showTabs, setShowTabs] = useState<boolean>(false)
    const params = useParams()

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

    const loadTab = (focusTab: TabType, switchTab = true) => {
        const focus = tabs.findIndex((tab) => tab.id === focusTab.id)
        if (focus === -1) {
            setTabs(tabs.concat([focusTab]))
            if (switchTab) {
                setActive(tabs.length)
            }
        } else {
            setActive(focus)
        }
        if (switchTab) {
            navigate(`/work/${params.work_id}/${focusTab.link}`)
        }
    }

    const removeTab = (id: string) => {
        const newTabs = tabs.filter((tab) => tab.id !== id)
        const activeTab = tabs.find((tab) => tab.id === id)

        setTabs(newTabs)

        if (newTabs.length) {
            if (activeTab.id === id) {
                setActive(newTabs[active] ? active : newTabs[active - 1] ? active - 1 : 0)
            } else {
                setActive(newTabs.findIndex((tab) => tab.id === activeTab.id))
            }
        } else {
            navigate(`/work/${params.work_id}`)
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
                setShowTabs
            }}>
            {children}
        </TabsContext.Provider>
    )
}

const useTabs = () => useContext(TabsContext)

export default useTabs
