import { useEffect, useState } from 'react'
import * as Grammarly from '@grammarly/editor-sdk'
import RichtextEditor from '@sl/components/RichtextEditor'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { wordCount } from '@sl/utils'
import { SectionViewType } from '../types'

const SceneView = ({ section }: SectionViewType) => {
    const [initialValue, setInitialValue] = useState<string>(section.body)
    const tabs = useTabs()

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    useEffect(() => {
        const editor = document.querySelector(
            'grammarly-editor-plugin'
        ) as Grammarly.GrammarlyEditorPluginElement
        if (editor) {
            editor.disconnect()
        }
        setInitialValue(section.body)
        setTimeout(() => {
            Grammarly.init('client_PJGNpq8df12athMYk8jcSr').then((grammarly) => {
                grammarly.addPlugin(document.getElementById('sceneBody'))
            })
        }, 500)
    }, [section.id])

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
