import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { makeStyles } from '@mui/styles'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import { $getSelection, $isRangeSelection } from 'lexical'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { $isTagNode, TOGGLE_TAG_COMMAND } from '../../nodes/Tag'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { Typography } from '@mui/material'

type AutocompleteOption = {
    id: string
    label: string
}

const TagEdit = ({ isTag }: { isTag: boolean }) => {
    const [editor] = useLexicalComposerContext()
    const [linkUrl, setLinkUrl] = useState<string>('')
    const [mode, setMode] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [options, setOptions] = useState<AutocompleteOption[]>([])
    const { characters, items, locations, notes } = useTabs()

    const useStyles = makeStyles({
        paper: {
            overflow: 'visible',
            boxShadow: 'none'
        }
    })

    const classes = useStyles()

    const updateLinkEditor = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const parent = node.getParent()
            const tagNode = $isTagNode(parent) ? parent : $isTagNode(node) ? node : null

            if (tagNode) {
                setAnchorEl(editor.getElementByKey(tagNode.getKey()))
                setLinkUrl(tagNode.getURL())
            } else {
                setAnchorEl(null)
                setLinkUrl('')
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
        if (!linkUrl) {
            setMode('')
            setId('')
            setTitle('')
            setOptions([])
            return
        }
        let parts

        const regex = /^\s*\/*\s*|\s*\/*\s*$/gm

        try {
            const url = new URL(linkUrl)
            parts = url.pathname.replace(regex, '').split('/')
        } catch {
            parts = linkUrl.replace(regex, '').split('/')
        }

        const [_mode, _id, _title] = parts

        if (!_mode || !['character', 'item', 'location', 'note'].includes(_mode)) {
            setMode('')
            setId('')
            setTitle('')
            setOptions([])
            return
        }

        setMode(_mode)
        setId(_id || '')
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

    return anchorEl && options.length ? (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            classes={classes}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}>
            <Box className='bg-white p-3' boxShadow={2}>
                <Autocomplete
                    sx={{ width: '300px' }}
                    getOptionLabel={(option: AutocompleteOption) => option.label}
                    options={options}
                    value={{ id, label: title }}
                    freeSolo
                    forcePopupIcon={true}
                    onChange={(event: SyntheticEvent, value: AutocompleteOption) => {
                        const url = value ? `/${mode}/${value.id}/${value.label}` : ''
                        setId(value?.id || '')
                        setTitle(value?.label || '')
                        setLinkUrl(url)
                        editor.dispatchCommand(TOGGLE_TAG_COMMAND, url)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={<Typography className='capitalize'>{mode}</Typography>}
                        />
                    )}
                />
            </Box>
        </Popover>
    ) : null
}

export default TagEdit
