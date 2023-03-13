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
import { TagNode } from './nodes/Tag'
import InitialValuePlugin from './plugins/InitialValue'
import TagPlugin from './plugins/Tag'
import ToolbarPlugin from './plugins/Toolbar'
import theme from './theme'
import { RichtextEditorProps } from './types'

const RichtextEditor = ({ scene, onSave, initialValue, setInitialValue }: RichtextEditorProps) => {
    const { autoSave, indentParagraph, spellCheck } = useSettings()
    const { t } = useTranslation()

    const doSave = debounce((html) => onSave(html), 1000)

    const Editor = () =>
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

    return (
        <LexicalComposer
            initialConfig={{
                namespace: 'rte',
                theme: { ...theme, ['paragraph']: indentParagraph ? 'indent-4 mb-2' : 'mb-2' },
                nodes: [ListItemNode, ListNode, QuoteNode, TagNode],
                onError(error: Error) {
                    throw error
                }
            }}>
            <ToolbarPlugin
                scene={scene}
                onSave={autoSave ? null : onSave}
                setInitialValue={setInitialValue}
            />
            <Box className='rte-container relative flex-grow overflow-auto h-0 p-3'>
                <RichTextPlugin
                    contentEditable={<Editor />}
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
                <InitialValuePlugin text={initialValue} />
                <ListPlugin />
                {autoSave ? (
                    <OnChangePlugin
                        onChange={(_, editor) => {
                            editor.update(() => {
                                doSave($generateHtmlFromNodes(editor, null))
                            })
                        }}
                    />
                ) : null}
                <TagPlugin />
            </Box>
        </LexicalComposer>
    )
}

export default RichtextEditor
