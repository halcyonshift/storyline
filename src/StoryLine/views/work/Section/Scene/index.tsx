import { useState } from 'react'
import RichtextEditor from '@sl/components/RichtextEditor'
import { SectionViewType } from '../types'

const SceneView = ({ section }: SectionViewType) => {
    const [initialValue] = useState<string>(section.body)

    const onSave = async (html: string) => {
        return await section.updateBody(html)
    }

    return <RichtextEditor onSave={onSave} initialValue={initialValue} />
}

export default SceneView
