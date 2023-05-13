import { useEffect, useState, ReactElement, SyntheticEvent } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { Autocomplete, Box, IconButton, Menu, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { CHARACTER_ICONS, ITEM_ICONS, LOCATION_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { AutocompleteOption } from '@sl/types'
import { MenuProps } from '../../types'
import { TOGGLE_TAG_COMMAND } from './Node'
import { TagModeType } from './types'

const TagMenu = ({
    open,
    menuElement,
    setMenu,
    setMenuElement,
    characters,
    items,
    locations,
    notes
}: MenuProps): ReactElement => {
    const [mode, setMode] = useState<TagModeType>('character')
    const [options, setOptions] = useState<AutocompleteOption[]>([])
    const [id, setId] = useState<string>('')
    const [label, setLabel] = useState<string>('')
    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()

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
    }, [mode, characters, items, locations, notes])

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
                <IconButton onClick={() => setMode('character')} className='text-emerald-600'>
                    {CHARACTER_ICONS.character}
                </IconButton>
                <IconButton onClick={() => setMode('location')} className='text-amber-600'>
                    {LOCATION_ICONS.location}
                </IconButton>
                <IconButton onClick={() => setMode('item')} className='text-purple-600'>
                    {ITEM_ICONS.item}
                </IconButton>
                <IconButton onClick={() => setMode('note')} className='text-sky-600'>
                    {NOTE_ICONS.note}
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
