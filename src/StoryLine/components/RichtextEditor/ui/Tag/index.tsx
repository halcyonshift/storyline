import { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { $getSelection, $isRangeSelection } from 'lexical'

import { $isTagNode, TOGGLE_TAG_COMMAND } from '../../nodes/Tag'
import Button from '@mui/material/Button'
import { getSelectedNode } from '../../utils/getSelectedNode'

const TagEdit = ({ isTag }: { isTag: boolean }) => {
    const [editor] = useLexicalComposerContext()
    const [linkUrl, setLinkUrl] = useState<string>('')
    const [editedUrl, setEditedUrl] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const transformNode = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setLinkUrl(editedUrl)
        editor.dispatchCommand(TOGGLE_TAG_COMMAND, editedUrl)
    }

    const updateLinkEditor = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const parent = node.getParent()
            if ($isTagNode(parent)) {
                setAnchorEl(editor.getElementByKey(parent.getKey()))
                setLinkUrl(parent.getURL())
                setEditedUrl(parent.getURL())
            } else if ($isTagNode(node)) {
                setAnchorEl(editor.getElementByKey(node.getKey()))
                setLinkUrl(node.getURL())
                setEditedUrl(node.getURL())
            } else {
                setAnchorEl(null)
                setLinkUrl('')
                setEditedUrl('')
            }
        }
        return true
    }, [])

    useEffect(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor()
        })
    }, [isTag, editor, updateLinkEditor])

    return anchorEl ? (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}>
            <Typography variant='body1'>{editedUrl}</Typography>
            <input
                className='w-full'
                value={editedUrl}
                onChange={(evt) => setEditedUrl(evt.target.value)}
                placeholder='Type your url here'
            />
            <form onSubmit={transformNode}>
                <Button disabled={editedUrl === linkUrl} type='submit'>
                    Save
                </Button>
            </form>
        </Popover>
    ) : (
        <></>
    )
}

export default TagEdit
