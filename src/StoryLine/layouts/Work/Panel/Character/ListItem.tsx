import Box from '@mui/material/Box'
import { ListItem as MuiListItem } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { CHARACTER_ICONS, GLOBAL_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { status } from '@sl/theme/utils'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { ListItemProps } from './types'

const ListItem = ({ character, showIcon }: ListItemProps) => {
    const tabs = useTabs()
    const { t } = useTranslation()

    return (
        <MuiListItem
            disablePadding
            disableGutters
            divider
            className='bg-slate-50 dark:bg-slate-600'
            sx={{ borderLeft: `8px solid ${status(character.status, 500).color}` }}>
            <ListItemText
                primary={
                    <Box className='flex justify-between align-middle'>
                        <ListItemButton
                            onClick={() => tabs.loadTab({ id: character.id, mode: 'character' })}>
                            {showIcon ? (
                                <Box className='pr-1'>
                                    {
                                        CHARACTER_ICONS[
                                            // eslint-disable-next-line max-len
                                            character.mode.toLowerCase() as keyof typeof CHARACTER_ICONS
                                        ]
                                    }
                                </Box>
                            ) : null}
                            <Typography
                                variant='body1'
                                className='whitespace-nowrap text-ellipsis overflow-hidden'>
                                {character.displayName}
                            </Typography>
                        </ListItemButton>
                        <Stack spacing={0} direction='row'>
                            <TooltipIconButton
                                size='small'
                                text='layout.work.panel.note.add'
                                link={`addNote/character/${character.id}`}
                                icon={NOTE_ICONS.add}
                            />
                            <TooltipIconButton
                                size='small'
                                text='layout.work.panel.character.edit'
                                link={`character/${character.id}/edit`}
                                icon={GLOBAL_ICONS.edit}
                            />
                            <TooltipIconButton
                                size='small'
                                text='layout.work.panel.character.delete'
                                icon={GLOBAL_ICONS.delete}
                                confirm={t('layout.work.panel.character.deleteConfirm', {
                                    name: character.displayName
                                })}
                                onClick={() => {
                                    tabs.removeTab(character.id)
                                    character.delete()
                                }}
                            />
                        </Stack>
                    </Box>
                }
            />
        </MuiListItem>
    )
}

export default ListItem
