import { useMemo, useRef, useState } from 'react'
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
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { EditorState, LexicalEditor } from 'lexical'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import useSettings from '@sl/theme/useSettings'
import InitialValuePlugin from './plugins/InitialValue'
import SavePlugin from './plugins/Save'
import SearchPlugin from './plugins/Search'
import TagPlugin from './plugins/Tag'
import { TagNode } from './plugins/Tag/Node'
import ToolbarPlugin from './plugins/Toolbar'
import VersionPlugin from './plugins/Version'
import theme from './theme'
import { RichtextEditorProps } from './types'

const RichtextEditor = ({ id, initialValue, toolbar, onSave, onChange }: RichtextEditorProps) => {
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [menu, setMenu] = useState<string | null>(null)
    const [menuElement, setMenuElement] = useState<HTMLElement | null>(null)
    const { autoSave, indentParagraph, spellCheck } = useSettings()
    const { t } = useTranslation()
    const ref = useRef<HTMLElement>()

    const doSave = debounce((html) => {
        if (isSaving) return
        setIsSaving(true)
        onSave(html)
        setIsSaving(false)
    }, 1000)

    const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
        editorState.read(() => {
            const html = $generateHtmlFromNodes(editor, null)
            if (onChange) {
                onChange(html)
            }
            if (autoSave) {
                doSave(html)
            }
        })
    }

    return useMemo(
        () => (
            <LexicalComposer
                initialConfig={{
                    namespace: 'rte',
                    theme: {
                        ...theme,
                        ...{
                            paragraph: indentParagraph
                                ? `indent-4 ${theme.paragraph}`
                                : theme.paragraph,
                            quote: indentParagraph ? `indent-4 ${theme.quote}` : theme.quote
                        }
                    },
                    nodes: [ListItemNode, ListNode, QuoteNode, TagNode],
                    onError(error: Error) {
                        throw error
                    }
                }}>
                <ToolbarPlugin
                    menu={menu}
                    setMenu={setMenu}
                    setMenuElement={setMenuElement}
                    config={toolbar}
                />
                <SearchPlugin />
                <Box
                    className='rte-container relative flex-grow overflow-auto h-0 p-3'
                    ref={ref}
                    id={`rte-${id}`}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className='resize-none caret-slate-500 outline-none'
                                spellCheck={spellCheck}
                            />
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
                    <InitialValuePlugin forwardRef={ref} value={initialValue} />
                    <ListPlugin />
                    <OnChangePlugin onChange={handleChange} />
                    <VersionPlugin
                        menu={menu}
                        menuElement={menuElement}
                        setMenu={setMenu}
                        setMenuElement={setMenuElement}
                    />
                    <SavePlugin onSave={onSave} />
                    <TagPlugin
                        menu={menu}
                        menuElement={menuElement}
                        setMenu={setMenu}
                        setMenuElement={setMenuElement}
                    />
                </Box>
            </LexicalComposer>
        ),
        [id, initialValue, menu, menuElement]
    )
}

export default RichtextEditor
