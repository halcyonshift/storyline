import { useEffect, useState, ReactElement, SyntheticEvent } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import CategoryIcon from '@mui/icons-material/Category'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { MenuProps } from '../../types'
import { TOGGLE_TAG_COMMAND } from './Node'
import { AutocompleteOption, TagModeType } from './types'

const TagMenu = ({ open, menuElement, setMenu, setMenuElement }: MenuProps): ReactElement => {
    const [mode, setMode] = useState<TagModeType>('character')
    const [options, setOptions] = useState<AutocompleteOption[]>([])
    const [id, setId] = useState<string>('')
    const [label, setLabel] = useState<string>('')

    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()
    const { characters, items, locations, notes } = useTabs()

    useEffect(() => {
        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        setOptions(
            data[mode as keyof typeof data].map((item) => ({
                id: item.id,
                label: item.displayName
            }))
        )
    }, [mode])

    return (
        <Menu
            id='menu'
            anchorEl={menuElement}
            open={Boolean(open && menuElement)}
            onClose={() => {
                setMenu(null)
                setMenuElement(null)
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            MenuListProps={{
                'aria-labelledby': `menu-tag`
            }}>
            <Box className='flex justify-around'>
                <IconButton onClick={() => setMode('character')}>
                    <PersonIcon className='text-emerald-600' />
                </IconButton>
                <IconButton onClick={() => setMode('location')}>
                    <LocationOnIcon className='text-amber-600' />
                </IconButton>
                <IconButton onClick={() => setMode('item')}>
                    <CategoryIcon className='text-purple-600' />
                </IconButton>
                <IconButton onClick={() => setMode('note')}>
                    <StickyNote2Icon className='text-sky-600' />
                </IconButton>
            </Box>
            <Box className='px-3 py-1'>
                <Autocomplete
                    className='w-[300px]'
                    getOptionLabel={(option: AutocompleteOption) => option?.label || ''}
                    options={options}
                    value={{ id, label }}
                    freeSolo
                    forcePopupIcon={true}
                    onChange={(event: SyntheticEvent, value: AutocompleteOption) => {
                        setId(value?.id || '')
                        setLabel(value?.label || '')
                        editor.dispatchCommand(
                            TOGGLE_TAG_COMMAND,
                            value?.id
                                ? {
                                      mode,
                                      id: value.id,
                                      title: value.label
                                  }
                                : null
                        )
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t('component.richtextEditor.toolbar.tag.label', {
                                mode: t(`component.richtextEditor.toolbar.tag.${mode}`)
                            })}
                        />
                    )}
                />
            </Box>
        </Menu>
    )
}

export default TagMenu
