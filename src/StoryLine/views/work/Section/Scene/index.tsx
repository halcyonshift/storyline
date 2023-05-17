import { useEffect, useState } from 'react'
import * as Grammarly from '@grammarly/editor-sdk'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import RichtextEditor from '@sl/components/RichtextEditor'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import useSettings from '@sl/theme/useSettings'
import { wordCount } from '@sl/utils'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import { SectionViewType } from '../types'

const SceneView = ({ section }: SectionViewType) => {
    const [initialValue, setInitialValue] = useState<string>(section.body)
    const work = useRouteLoaderData('work') as WorkModel
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
        const words = wordCount(html)

        if (!statistics.length || !statistics[0].isToday) {
            await section.addStatistic(words)
        } else {
            await statistics[0].updateWords(words)
        }

        const sprints = await work.sprint.fetch()
        const sprint = sprints.find(
            (sprint) => sprint.startAt <= new Date() && sprint.endAt >= new Date()
        )

        if (sprint) {
            const sprintStatistics = await sprint.sprint_statistic
                .extend(Q.where('section_id', section.id))
                .fetch()

            if (sprintStatistics.length) {
                await sprintStatistics[0].updateWords(words)
            }
        }
    }

    const plugins = ['excerpt', 'tag', 'search', 'save']

    return (
        <RichtextEditor
            id='sceneBody'
            onSave={onSave}
            initialValue={initialValue}
            toolbar={section.isVersion ? plugins : plugins.concat('version')}
        />
    )
}

export default SceneView
