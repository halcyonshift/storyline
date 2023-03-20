import { useCallback, useEffect, useState, ReactElement, SyntheticEvent } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createQuoteNode } from '@lexical/rich-text'
import { $wrapNodes } from '@lexical/selection'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import CategoryIcon from '@mui/icons-material/Category'
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
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import RedoIcon from '@mui/icons-material/Redo'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import UndoIcon from '@mui/icons-material/Undo'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
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
import { $isTagNode } from '../Tag/TagNode'
import { TagModeType } from '../Tag/types'

// eslint-disable-next-line complexity
const ToolbarPlugin = (): ReactElement => {
    const [canUndo, setCanUndo] = useState<boolean>(false)
    const [canRedo, setCanRedo] = useState<boolean>(false)
    const [blockType, setBlockType] = useState<string>('paragraph')
    const [isBold, setIsBold] = useState<boolean>(false)
    const [isItalic, setIsItalic] = useState<boolean>(false)
    const [isUnderline, setIsUnderline] = useState<boolean>(false)
    const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false)
    const [isTag, setIsTag] = useState<boolean>(false)
    const [menu, setMenu] = useState<string | null>(null)

    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()
    const tabs = useTabs()

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
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))
            setIsStrikethrough(selection.hasFormat('strikethrough'))
        }
    }, [editor])

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
                    1
                ),
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    (payload) => {
                        setCanUndo(payload)
                        return false
                    },
                    1
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    (payload) => {
                        setCanRedo(payload)
                        return false
                    },
                    1
                )
            ),
        [editor, updateToolbar]
    )

    return (
        <>
            <Stack direction='row' spacing={1} className='border-b border-t'>
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
                <Divider orientation='vertical' flexItem />
                <IconButton
                    aria-label={t('component.richtext.toolbar.excerpt')}
                    onClick={formatQuote}>
                    <TextSnippetIcon />
                </IconButton>
                <Divider orientation='vertical' flexItem />
                <IconButton
                    aria-label={t('component.richtext.toolbar.tag')}
                    id='tag-button'
                    aria-controls={menu === 'tag' ? 'tag-menu' : undefined}
                    aria-haspopup={true}
                    aria-expanded={menu === 'tag' ? 'true' : undefined}
                    onClick={() => {
                        setMenu(menu === 'tag' ? null : 'tag')
                    }}>
                    <LocalOfferIcon />
                </IconButton>
                <Divider orientation='vertical' flexItem />
                <IconButton
                    aria-label={t('component.richtext.toolbar.search')}
                    onClick={() => {
                        editor.dispatchCommand(TOGGLE_SEARCH_COMMAND, null)
                    }}>
                    <SearchIcon />
                </IconButton>
                <IconButton
                    aria-label={t('component.richtext.toolbar.revision')}
                    id='revision-button'
                    aria-controls={menu === 'revision' ? 'revision-menu' : undefined}
                    aria-haspopup={true}
                    aria-expanded={menu === 'revision' ? 'true' : undefined}
                    onClick={() => {
                        setMenu(menu === 'revision' ? null : 'revision')
                    }}>
                    <RestorePageIcon />
                </IconButton>
                <Divider orientation='vertical' flexItem />
                <IconButton
                    aria-label={t('component.richtext.toolbar.save')}
                    onClick={() => {
                        editor.dispatchCommand(SAVE_COMMAND, null)
                    }}>
                    <SaveIcon />
                </IconButton>
            </Stack>
        </>
    )
}

export default ToolbarPlugin
