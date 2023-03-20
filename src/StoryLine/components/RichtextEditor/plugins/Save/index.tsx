import { useCallback, useEffect, useState, ReactElement } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { Alert, Snackbar } from '@mui/material'
import { createCommand, COMMAND_PRIORITY_EDITOR, LexicalCommand } from 'lexical'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useOnKeyPressed } from '@sl/utils/useKeyPress'

export const SAVE_COMMAND: LexicalCommand<boolean> = createCommand()

const SavePlugin = ({
    onSave
}: {
    onSave: (html: string) => Promise<void>
}): ReactElement | null => {
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

    useOnKeyPressed('Meta+s', () => save())

    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()

    const doSave = useCallback(
        debounce(async (html) => {
            setIsSaving(true)
            await onSave(html)
            setShowSnackbar(true)
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

    return (
        <Snackbar
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={() => setShowSnackbar(false)} severity='success'>
                {t('component.richtextEditor.save.success')}
            </Alert>
        </Snackbar>
    )
}

export default SavePlugin
