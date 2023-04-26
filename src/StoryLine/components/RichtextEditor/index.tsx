import { useMemo, useRef, useEffect, useState } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import { ListItemNode, ListNode } from '@lexical/list'
import { QuoteNode } from '@lexical/rich-text'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { EditorState, LexicalEditor } from 'lexical'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import useSettings from '@sl/theme/useSettings'
import InitialValuePlugin from './plugins/InitialValue'
import SavePlugin from './plugins/Save'
import SearchPlugin from './plugins/Search'
import TagPlugin from './plugins/Tag'
import { TagNode } from './plugins/Tag/Node'
import { stripSlashes } from './plugins/Tag/utils'
import ToolbarPlugin from './plugins/Toolbar'
import VersionPlugin from './plugins/Version'
import theme from './theme'
import { RichtextEditorProps } from './types'

const RichtextEditor = ({ id, initialValue, toolbar, onSave, onChange }: RichtextEditorProps) => {
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [canSave, setCanSave] = useState<boolean>(false)
    const [menu, setMenu] = useState<string | null>(null)
    const [menuElement, setMenuElement] = useState<HTMLElement | null>(null)
    const {
        autoSave,
        editorFont,
        editorFontSize,
        indentParagraph,
        lineHeight,
        paragraphSpacing,
        spellCheck
    } = useSettings()
    const { loadTab } = useTabs()
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
            if (autoSave && (html !== initialValue || canSave)) {
                doSave(html)
                setCanSave(true)
                if (html === initialValue) {
                    setCanSave(false)
                }
            }
        })
    }

    const handleTagDblClick = (e: Event) => {
        const span = e.target as HTMLSpanElement
        const link = span.parentNode as HTMLAnchorElement
        const url = new URL(link.href)
        const parts = stripSlashes(url.pathname).split('/')
        if (parts.length === 3) {
            loadTab({
                id: parts[1],
                label: decodeURI(parts[2]),
                mode: parts[0] as 'character' | 'item' | 'location' | 'note' | 'section'
            })
        }
    }

    useEffect(() => setCanSave(false), [id])

    return useMemo(
        () => (
            <Box
                className='flex-grow flex flex-col'
                sx={{
                    fontFamily: editorFont,
                    fontSize: editorFontSize
                }}>
                <LexicalComposer
                    initialConfig={{
                        namespace: 'rte',
                        theme: {
                            ...theme,
                            ...{
                                paragraph: [
                                    `my-${paragraphSpacing}`,
                                    `leading-${lineHeight}`,
                                    indentParagraph ? 'indent-4' : ''
                                ].join(' '),
                                quote: [
                                    'bg-yellow-100',
                                    `my-${paragraphSpacing}`,
                                    `leading-${lineHeight}`,
                                    indentParagraph ? 'indent-4' : ''
                                ].join(' ')
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
                                    id='sceneBody'
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
                        <NodeEventPlugin
                            nodeType={TagNode}
                            eventType='dblclick'
                            eventListener={handleTagDblClick}
                        />
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
            </Box>
        ),
        [id, initialValue, menu, menuElement, paragraphSpacing, lineHeight, indentParagraph]
    )
}

export default RichtextEditor
