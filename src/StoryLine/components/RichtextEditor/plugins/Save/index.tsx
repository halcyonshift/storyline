import { useCallback, useEffect, useState } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { createCommand, COMMAND_PRIORITY_EDITOR, LexicalCommand } from 'lexical'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import useMessenger from '@sl/layouts/useMessenger'
import { useOnKeyPressed } from '@sl/utils/useKeyPress'
import { SavePluginProps } from './types'

export const SAVE_COMMAND: LexicalCommand<boolean> = createCommand()

const SavePlugin = ({ onSave }: SavePluginProps): null => {
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useOnKeyPressed('Meta+s', () => save())

    const [editor] = useLexicalComposerContext()
    const messenger = useMessenger()
    const { t } = useTranslation()

    const doSave = useCallback(
        debounce(async (html) => {
            setIsSaving(true)
            await onSave(html)
            messenger.success(t('component.richtextEditor.save.success'))
            setIsSaving(false)
        }, 1000),
        []
    )

    const save = async () => {
        if (isSaving) return
        editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null)
            doSave(htmlString)
        })
    }

    useEffect(() => {
        return editor.registerCommand<boolean>(
            SAVE_COMMAND,
            () => {
                if (!isSaving) {
                    save()
                }
                return true
            },
            COMMAND_PRIORITY_EDITOR
        )
    }, [isSaving])

    return null
}

export default SavePlugin
