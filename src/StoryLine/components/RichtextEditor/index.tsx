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
import { EditorState, LexicalEditor } from 'lexical'
import { useTranslation } from 'react-i18next'

import { useSettings } from '@sl/theme'
import InitialValuePlugin from './plugins/InitialValue'
import ToolbarPlugin from './plugins/Toolbar'
import theme from './theme'
import { RichtextEditorProps } from './types'

const RichtextEditor = ({ onChange, initialValue }: RichtextEditorProps) => {
    const { indentParagraph } = useSettings()
    const { t } = useTranslation()

    const initialConfig = {
        namespace: 'rte',
        theme: { ...theme, ['paragraph']: indentParagraph ? 'indent-4 mb-2' : 'mb-2' },
        nodes: [ListItemNode, ListNode, QuoteNode],
        onError(error: Error) {
            throw error
        }
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
            <Box className='rte-container relative flex-grow overflow-auto h-0 p-3'>
                <RichTextPlugin
                    contentEditable={
                        <GrammarlyEditorPlugin clientId='client_PJGNpq8df12athMYk8jcSr'>
                            <ContentEditable className='resize-none caret-slate-500 outline-none' />
                        </GrammarlyEditorPlugin>
                    }
                    placeholder={
                        <Typography
                            variant='body1'
                            className='text-slate-500 overflow-hidden absolute text-ellipsis
                            top-[15px] left-[10px] inline-block pointer-events-none'>
                            {t('component.richtextEditor.placeholder')}
                        </Typography>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <AutoFocusPlugin />
                <HistoryPlugin />
                {initialValue ? <InitialValuePlugin text={initialValue} /> : null}
                <ListPlugin />
                <OnChangePlugin
                    onChange={(editorState: EditorState, editor: LexicalEditor) => {
                        editor.update(() => {
                            const htmlString = $generateHtmlFromNodes(editor, null)
                            onChange(htmlString)
                        })
                    }}
                />
            </Box>
        </LexicalComposer>
    )
}

export default RichtextEditor
