import { useEffect, useState, ReactElement } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { Box, Menu, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Selector from '@sl/components/Selector'
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
    const [id, setId] = useState<string>('none')
    const [editor] = useLexicalComposerContext()
    const { t } = useTranslation()

    useEffect(() => {
        setId('none')
    }, [open])

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

    useEffect(() => {
        setId('none')
        editor.dispatchCommand(TOGGLE_TAG_COMMAND, null)
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
                'aria-labelledby': 'menu-tag'
            }}>
            <Selector onClick={(mode: TagModeType) => setMode(mode)} />
            <Box className='px-3 py-1'>
                <Select
                    className='w-[300px]'
                    value={id}
                    onChange={(event: SelectChangeEvent) => {
                        const _label =
                            options.find((option) => option.id === event.target.value)?.label ||
                            'none'
                        setId(event.target.value)
                        editor.dispatchCommand(
                            TOGGLE_TAG_COMMAND,
                            event.target.value !== 'none'
                                ? {
                                      mode,
                                      id: event.target.value,
                                      title: _label
                                  }
                                : null
                        )
                    }}
                    label={t('component.richtextEditor.toolbar.tag.label', {
                        mode: t(`component.richtextEditor.toolbar.tag.${mode}`)
                    })}>
                    <MenuItem value='none'>
                        {t('component.richtextEditor.toolbar.tag.label', {
                            mode: t(`component.richtextEditor.toolbar.tag.${mode}`)
                        })}
                    </MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Menu>
    )
}

export default TagMenu
