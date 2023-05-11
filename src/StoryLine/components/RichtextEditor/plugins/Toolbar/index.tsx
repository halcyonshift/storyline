import { useCallback, useEffect, useState, ReactElement } from 'react'
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode
} from '@lexical/list'
import { $createQuoteNode, $isQuoteNode } from '@lexical/rich-text'
import { $wrapNodes } from '@lexical/selection'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { Box, IconButton, Stack } from '@mui/material'
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from 'lexical'
import { useTranslation } from 'react-i18next'
import { RICHTEXT_ICONS } from '@sl/constants/icons'
import useLayout from '@sl/layouts/Work/useLayout'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { SAVE_COMMAND } from '../Save'
import { TOGGLE_SEARCH_COMMAND } from '../Search'
import { $isTagNode, TOGGLE_TAG_COMMAND } from '../Tag/Node'
import { ToolbarPluginProps } from './types'

// eslint-disable-next-line complexity
const ToolbarPlugin = ({
    menu,
    setMenu,
    setMenuElement,
    config
}: ToolbarPluginProps): ReactElement => {
    const { windowWidth, navigationWidth, panelWidth } = useLayout()
    const [toolbarWidth, setToolbarWidth] = useState<number>(
        windowWidth - navigationWidth - panelWidth
    )
    const [canUndo, setCanUndo] = useState<boolean>(false)
    const [canRedo, setCanRedo] = useState<boolean>(false)
    const [blockType, setBlockType] = useState<string>('paragraph')
    const [isBold, setIsBold] = useState<boolean>(false)
    const [isItalic, setIsItalic] = useState<boolean>(false)
    const [isUnderline, setIsUnderline] = useState<boolean>(false)
    const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false)
    const [isQuote, setIsQuote] = useState<boolean>(false)
    const [isTag, setIsTag] = useState<boolean>(false)
    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection)) {
                if (blockType !== 'quote') {
                    $wrapNodes(selection, () => $createQuoteNode())
                } else {
                    $wrapNodes(selection, () => $createParagraphNode())
                }
            }
        })
    }

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode()
            const element =
                anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
            const elementKey = element.getKey()
            const elementDOM = editor.getElementByKey(elementKey)

            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode)
                    const type = parentList ? parentList.getTag() : element.getTag()
                    setBlockType(type)
                } else {
                    setBlockType(element.getType())
                }
            }

            const node = getSelectedNode(selection)
            const parent = node.getParent()

            setIsTag($isTagNode(node) || $isTagNode(parent))
            setIsQuote($isQuoteNode(node) || $isQuoteNode(parent))
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))
            setIsStrikethrough(selection.hasFormat('strikethrough'))
        }
    }, [editor])

    useEffect(() => {
        setToolbarWidth(windowWidth - navigationWidth - panelWidth)
    }, [windowWidth, navigationWidth, panelWidth])

    useEffect(
        () =>
            mergeRegister(
                editor.registerUpdateListener(({ editorState }) => {
                    editorState.read(() => {
                        updateToolbar()
                    })
                }),
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    () => {
                        updateToolbar()
                        return false
                    },
                    COMMAND_PRIORITY_LOW
                ),
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    (payload) => {
                        setCanUndo(payload)
                        return false
                    },
                    COMMAND_PRIORITY_LOW
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    (payload) => {
                        setCanRedo(payload)
                        return false
                    },
                    COMMAND_PRIORITY_LOW
                )
            ),
        [editor, updateToolbar]
    )

    return (
        <Box
            id='toolbarContainer'
            className='border-b overflow-x-auto scrollbar-hidden'
            sx={{ width: `${toolbarWidth}px` }}>
            <Stack direction='row' spacing={1}>
                <IconButton
                    disabled={!canUndo}
                    aria-label={t('component.richtextEditor.toolbar.undo')}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
                    {RICHTEXT_ICONS.undo}
                </IconButton>
                <IconButton
                    disabled={!canRedo}
                    aria-label={t('component.richtextEditor.toolbar.redo')}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
                    {RICHTEXT_ICONS.redo}
                </IconButton>
                <IconButton
                    color={isBold ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.bold')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                    {RICHTEXT_ICONS.bold}
                </IconButton>
                <IconButton
                    color={isItalic ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.italic')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                    {RICHTEXT_ICONS.italic}
                </IconButton>
                <IconButton
                    color={isUnderline ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.underlined')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                    {RICHTEXT_ICONS.underline}
                </IconButton>
                <IconButton
                    color={isStrikethrough ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.strikethrough')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                    {RICHTEXT_ICONS.strike}
                </IconButton>
                {config.includes('excerpt') ? (
                    <IconButton
                        color={isQuote ? 'primary' : 'default'}
                        aria-label={t('component.richtextEditor.toolbar.excerpt')}
                        onClick={formatQuote}>
                        {RICHTEXT_ICONS.excerpt}
                    </IconButton>
                ) : null}
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.listBulleted')}
                    onClick={() =>
                        editor.dispatchCommand(
                            blockType !== 'ul'
                                ? INSERT_UNORDERED_LIST_COMMAND
                                : REMOVE_LIST_COMMAND,
                            undefined
                        )
                    }>
                    {RICHTEXT_ICONS.ul}
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.listOrdered')}
                    onClick={() =>
                        editor.dispatchCommand(
                            blockType !== 'ol' ? INSERT_ORDERED_LIST_COMMAND : REMOVE_LIST_COMMAND,
                            undefined
                        )
                    }>
                    {RICHTEXT_ICONS.ol}
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignLeft')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
                    }}>
                    {RICHTEXT_ICONS.alignLeft}
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignCenter')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
                    }}>
                    {RICHTEXT_ICONS.alignCenter}
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignRight')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
                    }}>
                    {RICHTEXT_ICONS.alignRight}
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignJustify')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
                    }}>
                    {RICHTEXT_ICONS.alignJustify}
                </IconButton>
                {config.includes('tag') ? (
                    <IconButton
                        id='menu-tag'
                        aria-label={t('component.richtextEditor.toolbar.tag.label')}
                        aria-controls={menu ? 'menu' : undefined}
                        aria-haspopup={true}
                        aria-expanded={menu ? 'true' : undefined}
                        onClick={(e) => {
                            editor.update(() => {
                                const selection = $getSelection()
                                if (selection.getTextContent() || isTag) {
                                    editor.dispatchCommand(TOGGLE_TAG_COMMAND, null)
                                    setMenu('tag')
                                    setMenuElement(menu ? null : e.currentTarget)
                                }
                            })
                        }}>
                        {RICHTEXT_ICONS.tag}
                    </IconButton>
                ) : null}
                {config.includes('search') ? (
                    <IconButton
                        aria-label={t('component.richtextEditor.toolbar.search')}
                        onClick={() => {
                            editor.dispatchCommand(TOGGLE_SEARCH_COMMAND, null)
                        }}>
                        {RICHTEXT_ICONS.search}
                    </IconButton>
                ) : null}
                {config.includes('version') ? (
                    <IconButton
                        id='menu-version'
                        aria-label={t('component.richtextEditor.toolbar.version.label')}
                        aria-controls={menu ? 'menu' : undefined}
                        aria-haspopup={true}
                        aria-expanded={menu ? 'true' : undefined}
                        onClick={(e) => {
                            setMenu('version')
                            setMenuElement(menu ? null : e.currentTarget)
                        }}>
                        {RICHTEXT_ICONS.version}
                    </IconButton>
                ) : null}
                {config.includes('save') ? (
                    <IconButton
                        aria-label={t('component.richtextEditor.toolbar.save')}
                        onClick={() => {
                            editor.dispatchCommand(SAVE_COMMAND, null)
                        }}>
                        {RICHTEXT_ICONS.save}
                    </IconButton>
                ) : null}
            </Stack>
        </Box>
    )
}

export default ToolbarPlugin
