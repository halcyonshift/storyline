import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TabType, TabsContextType, TabsProviderProps } from '../types'

const TabsContext = createContext({} as TabsContextType)

export const TabsProvider = ({ children }: TabsProviderProps) => {
    const [tabs, setTabs] = useState<TabType[]>([])
    const [active, setActive] = useState<number>(null)
    const [showTabs, setShowTabs] = useState<boolean>(false)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => focusTab(), [tabs, active])

    useEffect(() => {
        if (tabs.length) return
        setShowTabs(false)
        setActive(null)
    }, [tabs])

    useEffect(() => {
        if (showTabs) focusTab()
    }, [showTabs])

    const focusTab = () => {
        if (!tabs[active]) return
        const tab = tabs[active]
        const link = tab.link || `${tab.mode}/${tab.id}`
        navigate(`/work/${params.work_id}/${link}`)
    }

    const loadTab = (tab: TabType) => {
        const tabIndex = tabs.findIndex((t) => tab.id === t.id)
        if (tabIndex === -1) {
            setTabs(tabs.concat([tab]))
            setActive(tabs.length)
        } else {
            setActive(tabIndex)
        }
        setShowTabs(true)
    }

    const removeTab = (id: string) => {
        const activeTab = tabs.find((tab) => tab.id === id)
        if (!activeTab) return

        const newTabs = tabs.filter((tab) => tab.id !== id)

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
