import { useCallback, useEffect, useState, ReactElement } from 'react'
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode
} from '@lexical/list'
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
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import {
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
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { SAVE_COMMAND } from '../Save'
import { TOGGLE_SEARCH_COMMAND } from '../Search'
import { $isTagNode, TOGGLE_TAG_COMMAND } from '../Tag/Node'
import { stripSlashes } from '../Tag/utils'
import { ToolbarPluginProps } from './types'

// eslint-disable-next-line complexity
const ToolbarPlugin = ({
    menu,
    setMenu,
    setMenuElement,
    config
}: ToolbarPluginProps): ReactElement => {
    const [canUndo, setCanUndo] = useState<boolean>(false)
    const [canRedo, setCanRedo] = useState<boolean>(false)
    const [blockType, setBlockType] = useState<string>('paragraph')
    const [isBold, setIsBold] = useState<boolean>(false)
    const [isItalic, setIsItalic] = useState<boolean>(false)
    const [isUnderline, setIsUnderline] = useState<boolean>(false)
    const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false)
    const [isHighlight, setIsHighlight] = useState<boolean>(false)
    const [isTag, setIsTag] = useState<boolean>(false)
    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()
    const { loadTab } = useTabs()

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
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))
            setIsStrikethrough(selection.hasFormat('strikethrough'))
            setIsHighlight(selection.hasFormat('highlight'))
        }
    }, [editor])

    useEffect(() => {
        if (!isTag) return

        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                const node = getSelectedNode(selection)
                const parent = node.getParent()
                const tagNode = $isTagNode(node) ? node : parent
                const linkUrl = tagNode.getURL()
                const parts = stripSlashes(linkUrl).split('/')

                loadTab(
                    {
                        id: parts[1],
                        label: parts[2],
                        link: `${parts[0]}/${parts[1]}`
                    },
                    false
                )
            }
        })
    }, [isTag, editor])

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
        <>
            <Stack direction='row' spacing={1} className='border-b'>
                <IconButton
                    disabled={!canUndo}
                    aria-label={t('component.richtext.toolbar.undo')}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
                    <UndoIcon />
                </IconButton>
                <IconButton
                    disabled={!canRedo}
                    aria-label={t('component.richtext.toolbar.redo')}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
                    <RedoIcon />
                </IconButton>
                <Divider orientation='vertical' flexItem />
                <IconButton
                    color={isBold ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.bold')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                    <FormatBoldIcon />
                </IconButton>
                <IconButton
                    color={isItalic ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.italic')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                    <FormatItalicIcon />
                </IconButton>
                <IconButton
                    color={isUnderline ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.underlined')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                    <FormatUnderlinedIcon />
                </IconButton>
                <IconButton
                    color={isStrikethrough ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.strikethrough')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                    <FormatStrikethroughIcon />
                </IconButton>
                {config.includes('excerpt') ? (
                    <>
                        <Divider orientation='vertical' flexItem />
                        <IconButton
                            color={isHighlight ? 'primary' : 'default'}
                            aria-label={t('component.richtext.toolbar.excerpt')}
                            onClick={() =>
                                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')
                            }>
                            <LabelImportantIcon />
                        </IconButton>
                    </>
                ) : null}
                <Divider orientation='vertical' flexItem />
                <IconButton
                    aria-label={t('component.richtext.toolbar.listBulleted')}
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
                    aria-label={t('component.richtext.toolbar.listOrdered')}
                    onClick={() =>
                        editor.dispatchCommand(
                            blockType !== 'ol' ? INSERT_ORDERED_LIST_COMMAND : REMOVE_LIST_COMMAND,
                            undefined
                        )
                    }>
                    <FormatListNumberedIcon />
                </IconButton>
                <Divider orientation='vertical' flexItem />
                <IconButton
                    aria-label={t('component.richtext.toolbar.alignLeft')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
                    }}>
                    <FormatAlignLeftIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtext.toolbar.alignCenter')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
                    }}>
                    <FormatAlignCenterIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtext.toolbar.alignRight')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
                    }}>
                    <FormatAlignRightIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtext.toolbar.alignJustify')}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
                    }}>
                    <FormatAlignJustifyIcon />
                </IconButton>
                {config.includes('tag') ? (
                    <>
                        <Divider orientation='vertical' flexItem />
                        <IconButton
                            id='menu-tag'
                            aria-label={t('component.richtext.toolbar.tag')}
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
                    </>
                ) : null}
                {config.includes('search') ? (
                    <>
                        <Divider orientation='vertical' flexItem />
                        <IconButton
                            aria-label={t('component.richtext.toolbar.search')}
                            onClick={() => {
                                editor.dispatchCommand(TOGGLE_SEARCH_COMMAND, null)
                            }}>
                            <SearchIcon />
                        </IconButton>
                    </>
                ) : null}
                {config.includes('version') ? (
                    <>
                        <Divider orientation='vertical' flexItem />
                        <IconButton
                            id='menu-version'
                            aria-label={t('component.richtext.toolbar.version')}
                            aria-controls={menu ? 'menu' : undefined}
                            aria-haspopup={true}
                            aria-expanded={menu ? 'true' : undefined}
                            onClick={(e) => {
                                setMenu('version')
                                setMenuElement(menu ? null : e.currentTarget)
                            }}>
                            <RestorePageIcon />
                        </IconButton>
                    </>
                ) : null}
                {config.includes('save') ? (
                    <>
                        <Divider orientation='vertical' flexItem />
                        <IconButton
                            aria-label={t('component.richtext.toolbar.save')}
                            onClick={() => {
                                editor.dispatchCommand(SAVE_COMMAND, null)
                            }}>
                            <SaveIcon />
                        </IconButton>
                    </>
                ) : null}
            </Stack>
        </>
    )
}

export default ToolbarPlugin
