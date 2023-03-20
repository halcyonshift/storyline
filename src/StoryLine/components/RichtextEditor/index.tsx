import { useEffect, useMemo, useState } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import { ListItemNode, ListNode } from '@lexical/list'
import { QuoteNode } from '@lexical/rich-text'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import useSettings from '@sl/theme/useSettings'

import InitialValuePlugin from './plugins/InitialValue'
import SavePlugin from './plugins/Save'
import SearchPlugin from './plugins/Search'
import TagPlugin from './plugins/Tag'
import { TagNode } from './plugins/Tag/Node'
import ToolbarPlugin from './plugins/Toolbar'
import theme from './theme'
import { RichtextEditorProps } from './types'

const RichtextEditor = ({ id, onSave, initialValue }: RichtextEditorProps) => {
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const { autoSave, indentParagraph, spellCheck } = useSettings()
    const { t } = useTranslation()

    const doSave = debounce((html) => {
        if (isSaving) return
        setIsSaving(true)
        onSave(html)
        setIsSaving(false)
    }, 1000)

    return useMemo(
        () => (
            <LexicalComposer
                initialConfig={{
                    namespace: 'rte',
                    theme: { ...theme, ['paragraph']: indentParagraph ? 'indent-4 mb-2' : 'mb-2' },
                    nodes: [ListItemNode, ListNode, QuoteNode, TagNode],
                    onError(error: Error) {
                        throw error
                    }
                }}>
                <ToolbarPlugin />
                <SearchPlugin />
                <Box className='rte-container relative flex-grow overflow-auto h-0 p-3'>
                    <RichTextPlugin
                        contentEditable={
                            spellCheck ? (
                                <GrammarlyEditorPlugin clientId='client_PJGNpq8df12athMYk8jcSr'>
                                    <ContentEditable
                                        className='resize-none caret-slate-500 outline-none'
                                        spellCheck={true}
                                    />
                                </GrammarlyEditorPlugin>
                            ) : (
                                <ContentEditable
                                    className='resize-none caret-slate-500 outline-none'
                                    spellCheck={false}
                                />
                            )
                        }
                        placeholder={
                            <Typography
                                variant='body1'
                                className='text-slate-500 overflow-hidden absolute
                    top-[15px] left-[10px] inline-block pointer-events-none'>
                                {t('component.richtextEditor.placeholder')}
                            </Typography>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <AutoFocusPlugin />
                    <HistoryPlugin />
                    <InitialValuePlugin value={initialValue} />
                    <ListPlugin />
                    <OnChangePlugin
                        onChange={(editorState, editor) => {
                            editorState.read(() => {
                                const html = $generateHtmlFromNodes(editor, null)
                                if (autoSave) {
                                    doSave(html)
                                }
                            })
                        }}
                    />
                    <SavePlugin onSave={onSave} />
                    <TagPlugin />
                </Box>
            </LexicalComposer>
        ),
        [id, initialValue]
    )
}

export default RichtextEditor
