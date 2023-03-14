import Box from '@mui/material/Box'
import { ListItem as MuiListItem } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import CharacterModel from '@sl/db/models/CharacterModel'
import { status } from '@sl/theme/utils'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useTabs from '@sl/layouts/Work/useTabs'

const ListItem = ({ character }: { character: CharacterModel }) => {
    const tabs = useTabs()
    const { t } = useTranslation()

    return (
        <MuiListItem disablePadding disableGutters divider>
            <ListItemText
                primary={
                    <Box
                        className='flex justify-between align-middle'
                        sx={{ backgroundColor: status(character.status).color }}>
                        <ListItemButton
                            onClick={() =>
                                tabs.loadTab({
                                    id: character.id,
                                    label: character.displayName,
                                    link: `character/${character.id}`
                                })
                            }>
                            <Typography
                                variant='body1'
                                className='whitespace-nowrap text-ellipsis overflow-hidden'>
                                {character.displayName}
                            </Typography>
                        </ListItemButton>
                        <Stack spacing={0} direction='row'>
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
                                    return character.delete()
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
