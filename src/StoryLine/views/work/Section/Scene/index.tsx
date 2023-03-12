import { useEffect, useState } from 'react'
import RichtextEditor from '@sl/components/RichtextEditor'
import useTabs from '@sl/layouts/Work/useTabs'
import { SectionViewType } from '../types'

const SceneView = ({ section }: SectionViewType) => {
    const [initialValue, setInitialValue] = useState<string>(section.body)
    const tabs = useTabs()

    useEffect(() => {
        tabs.setShowTabs(true)
    }, [])

    useEffect(() => {
        setInitialValue(section.body)
    }, [section.id])

    const onSave = async (html: string) => {
        return await section.updateBody(html)
    }

    return <RichtextEditor id={section.id} onSave={onSave} initialValue={initialValue} />
}

export default SceneView
