import { useState } from 'react'

import SettingsForm from '@sl/forms/StoryLine/Settings'
import { useSettings } from '@sl/theme'
import { SettingsDataType } from '@sl/theme/types'

const SettingsView = () => {
    const { displayMode, font, fontSize, language, indentParagraph } = useSettings()
    const [initialValues] = useState<SettingsDataType>({
        displayMode,
        font,
        fontSize,
        language,
        indentParagraph
    })

    return <SettingsForm initialValues={initialValues} />
}

export default SettingsView
