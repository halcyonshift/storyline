import { useState } from 'react'
import RichtextEditor from '@sl/components/RichtextEditor'
import { SectionViewType } from '../types'

const SceneView = ({ section }: SectionViewType) => {
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [initialValue] = useState<string>(section.body)

    const onChange = (html: string) => {
        if (isSaving) return
        //setIsSaving(true)
        //section.updateBody(html).then(() => setIsSaving(false))
    }
    return <RichtextEditor onChange={onChange} initialValue={initialValue} />
}

export default SceneView
