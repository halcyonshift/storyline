import { useState } from 'react'
import SettingsForm from '@sl/forms/StoryLine/Settings'
import useSettings from '@sl/theme/useSettings'
import { SettingsDataType } from '@sl/theme/types'

const SettingsView = () => {
    const {
        autoSave,
        autoBackupFreq,
        autoBackupPath,
        displayMode,
        appFont,
        appFontSize,
        editorFont,
        editorFontSize,
        indentParagraph,
        language,
        lineHeight,
        palette,
        paragraphSpacing,
        spellCheck
    } = useSettings()
    const [initialValues] = useState<SettingsDataType>({
        autoSave,
        autoBackupFreq,
        autoBackupPath,
        displayMode,
        appFont,
        appFontSize,
        editorFont,
        editorFontSize,
        indentParagraph,
        language,
        lineHeight,
        palette,
        paragraphSpacing,
        spellCheck
    })

    return <SettingsForm initialValues={initialValues} />
}

export default SettingsView
