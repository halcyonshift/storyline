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
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import RestorePageIcon from '@mui/icons-material/RestorePage'
import RedoIcon from '@mui/icons-material/Redo'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import LabelImportantIcon from '@mui/icons-material/LabelImportant'
import UndoIcon from '@mui/icons-material/Undo'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
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
import useLayout from '@sl/layouts/Work/useLayout'
import { getHex } from '@sl/theme/utils'
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
            sx={{ backgroundColor: getHex('slate', 100), width: `${toolbarWidth}px` }}>
            <Stack direction='row' spacing={1}>
                <IconButton
                    disabled={!canUndo}
                    aria-label={t('component.richtextEditor.toolbar.undo')}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
                    <UndoIcon />
                </IconButton>
                <IconButton
                    disabled={!canRedo}
                    aria-label={t('component.richtextEditor.toolbar.redo')}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
                    <RedoIcon />
                </IconButton>
                <IconButton
                    color={isBold ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.bold')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                    <FormatBoldIcon />
                </IconButton>
                <IconButton
                    color={isItalic ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.italic')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                    <FormatItalicIcon />
                </IconButton>
                <IconButton
                    color={isUnderline ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.underlined')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                    <FormatUnderlinedIcon />
                </IconButton>
                <IconButton
                    color={isStrikethrough ? 'primary' : 'default'}
                    aria-label={t('component.richtextEditor.toolbar.strikethrough')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                    <FormatStrikethroughIcon />
                </IconButton>
                {config.includes('excerpt') ? (
                    <IconButton
                        color={isQuote ? 'primary' : 'default'}
                        aria-label={t('component.richtextEditor.toolbar.excerpt')}
                        onClick={formatQuote}>
                        <LabelImportantIcon />
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
                    <FormatListBulletedIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.listOrdered')}
                    onClick={() =>
                        editor.dispatchCommand(
                            blockType !== 'ol' ? INSERT_ORDERED_LIST_COMMAND : REMOVE_LIST_COMMAND,
                            undefined
                        )
                    }>
                    <FormatListNumberedIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignLeft')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
                    }}>
                    <FormatAlignLeftIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignCenter')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
                    }}>
                    <FormatAlignCenterIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignRight')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
                    }}>
                    <FormatAlignRightIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtextEditor.toolbar.alignJustify')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
                    }}>
                    <FormatAlignJustifyIcon />
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
                        <LocalOfferIcon />
                    </IconButton>
                ) : null}
                {config.includes('search') ? (
                    <IconButton
                        aria-label={t('component.richtextEditor.toolbar.search')}
                        onClick={() => {
                            editor.dispatchCommand(TOGGLE_SEARCH_COMMAND, null)
                        }}>
                        <SearchIcon />
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
                        <RestorePageIcon />
                    </IconButton>
                ) : null}
                {config.includes('save') ? (
                    <IconButton
                        aria-label={t('component.richtextEditor.toolbar.save')}
                        onClick={() => {
                            editor.dispatchCommand(SAVE_COMMAND, null)
                        }}>
                        <SaveIcon />
                    </IconButton>
                ) : null}
            </Stack>
        </Box>
    )
}

export default ToolbarPlugin
