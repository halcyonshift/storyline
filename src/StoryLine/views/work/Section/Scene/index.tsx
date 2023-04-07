import { useEffect, useState } from 'react'
import * as Grammarly from '@grammarly/editor-sdk'
import RichtextEditor from '@sl/components/RichtextEditor'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import useSettings from '@sl/theme/useSettings'
import { wordCount } from '@sl/utils'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import { SectionViewType } from '../types'

const SceneView = ({ section }: SectionViewType) => {
    const [initialValue, setInitialValue] = useState<string>(section.body)
    const isOnline = useOnlineStatus()
    const settings = useSettings()
    const tabs = useTabs()

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    useEffect(() => {
        if (settings.spellCheck) {
            const editor = document.querySelector(
                'grammarly-editor-plugin'
            ) as Grammarly.GrammarlyEditorPluginElement
            if (editor) {
                editor.disconnect()
            }
        }

        setInitialValue(section.body)

        if (settings.spellCheck && isOnline) {
            setTimeout(() => {
                Grammarly.init(process.env.GRAMMARLY_CLIENT_ID, {
                    documentDomain: 'creative',
                    documentDialect: 'auto-text'
                }).then((grammarly) => {
                    grammarly.addPlugin(document.getElementById('sceneBody'))
                })
            }, 100)
        }
    }, [section.id, settings.spellCheck])

    const onSave = async (html: string) => {
        await section.updateBody(html)

        const statistics = await section.statistics.fetch()

        if (!statistics.length || !statistics[0].isToday) {
            await section.addStatistic(wordCount(html))
        } else {
            await statistics[0].updateWords(wordCount(html))
        }
    }

    const plugins = ['excerpt', 'tag', 'search', 'save']

    return (
        <RichtextEditor
            id={section.id}
            onSave={onSave}
            initialValue={initialValue}
            toolbar={section.isVersion ? plugins : plugins.concat('version')}
        />
    )
}

export default SceneView
