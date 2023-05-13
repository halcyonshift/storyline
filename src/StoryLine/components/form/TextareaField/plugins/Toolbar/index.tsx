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
import { IconButton, Stack } from '@mui/material'
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND
} from 'lexical'
import { useTranslation } from 'react-i18next'
import { RICHTEXT_ICONS } from '@sl/constants/icons'

const ToolbarPlugin = (): ReactElement => {
    const [blockType, setBlockType] = useState<string>('paragraph')
    const [isBold, setIsBold] = useState<boolean>(false)
    const [isItalic, setIsItalic] = useState<boolean>(false)
    const [isUnderline, setIsUnderline] = useState<boolean>(false)
    const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false)

    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()

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
                )
            ),
        [editor, updateToolbar]
    )

    return (
        <>
            <Stack direction='row' spacing={1} className='border-b'>
                <IconButton
                    color={isBold ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.bold')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                    {RICHTEXT_ICONS.bold}
                </IconButton>
                <IconButton
                    color={isItalic ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.italic')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                    {RICHTEXT_ICONS.italic}
                </IconButton>
                <IconButton
                    color={isUnderline ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.underlined')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                    {RICHTEXT_ICONS.underline}
                </IconButton>
                <IconButton
                    color={isStrikethrough ? 'primary' : 'default'}
                    aria-label={t('component.richtext.toolbar.strikethrough')}
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                    {RICHTEXT_ICONS.strike}
                </IconButton>
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
                    {RICHTEXT_ICONS.ul}
                </IconButton>
                <IconButton
                    aria-label={t('component.richtext.toolbar.listOrdered')}
                    onClick={() =>
                        editor.dispatchCommand(
                            blockType !== 'ol' ? INSERT_ORDERED_LIST_COMMAND : REMOVE_LIST_COMMAND,
                            undefined
                        )
                    }>
                    {RICHTEXT_ICONS.ol}
                </IconButton>
            </Stack>
        </>
    )
}

export default ToolbarPlugin
