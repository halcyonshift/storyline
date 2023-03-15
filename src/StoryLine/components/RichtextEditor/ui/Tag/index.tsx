import { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { $getSelection, $isRangeSelection } from 'lexical'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { $isTagNode, TOGGLE_TAG_COMMAND } from '../../nodes/Tag'
import { getSelectedNode } from '../../utils/getSelectedNode'

const TagEdit = ({ isTag }: { isTag: boolean }) => {
    const [editor] = useLexicalComposerContext()
    const [linkUrl, setLinkUrl] = useState<string>('')
    const [editedUrl, setEditedUrl] = useState<string>('')
    const [mode, setMode] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [options, setOptions] = useState<{ id: string; label: string }[]>([])
    const { characters, items, locations, notes } = useTabs()

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

    useEffect(() => {
        const url = linkUrl.replace('http://localhost:3000/', '')
        const [_mode, _id, _title] = url.split('/')

        if (!_mode || !['character', 'item', 'location', 'note'].includes(_mode)) {
            setMode('')
            setId('')
            setTitle('')
            setOptions([])
            return
        }

        setMode(_mode)
        setId(_id)
        setTitle(_title || '')

        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        setOptions(
            data[_mode as keyof typeof data].map((item) => ({
                id: item.id,
                label: item.displayName
            }))
        )
    }, [linkUrl])

    return anchorEl ? (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
                <InputLabel id='tag-label' className='capitalize'>
                    {mode}
                </InputLabel>
                <Select
                    labelId='tag-label'
                    value={options.find((opt) => opt.id === id)?.id || 0}
                    label={mode}
                    onChange={(e: SelectChangeEvent) => {
                        let newUrl
                        if (e.target.value) {
                            newUrl = `${mode}/${e.target.value}/${
                                options.find((opt) => opt.id === id)?.label
                            }`
                        } else {
                            newUrl = ''
                        }
                        setEditedUrl(newUrl)
                        setLinkUrl(newUrl)
                        editor.dispatchCommand(TOGGLE_TAG_COMMAND, newUrl)
                    }}>
                    <MenuItem value={0}>None</MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Popover>
    ) : (
        <></>
    )
}

export default TagEdit
