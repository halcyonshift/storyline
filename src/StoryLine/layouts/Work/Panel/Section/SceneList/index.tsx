import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { GLOBAL_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import { status } from '@sl/theme/utils'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useTabs from '@sl/layouts/Work/useTabs'

import { SceneListProps } from '../types'
import { useTranslation } from 'react-i18next'

const SceneList = ({ scenes }: SceneListProps) => {
    const tabs = useTabs()
    const { t } = useTranslation()

    return (
        <List dense disablePadding className='bg-white'>
            {scenes.map((scene) => (
                <ListItem key={scene.id} disablePadding disableGutters divider>
                    <ListItemText
                        primary={
                            <Box
                                className='flex justify-between align-middle'
                                sx={{ backgroundColor: status(scene.status).color }}>
                                <ListItemButton
                                    onClick={() =>
                                        tabs.loadTab({
                                            id: scene.id,
                                            label: scene.displayTitle,
                                            link: `section/${scene.id}`
                                        })
                                    }>
                                    <Typography
                                        variant='body1'
                                        className='whitespace-nowrap text-ellipsis overflow-hidden'>
                                        {scene.displayTitle}
                                    </Typography>
                                </ListItemButton>
                                <Stack spacing={0} direction='row'>
                                    <TooltipIconButton
                                        size='small'
                                        text='layout.work.panel.section.addRevision'
                                        icon={SECTION_ICONS.revision}
                                        onClick={() => scene.addRevision()}
                                    />
                                    <TooltipIconButton
                                        size='small'
                                        text='layout.work.panel.section.edit'
                                        link={`section/${scene.id}/edit`}
                                        icon={GLOBAL_ICONS.edit}
                                    />
                                    <TooltipIconButton
                                        size='small'
                                        text='layout.work.panel.section.delete'
                                        icon={GLOBAL_ICONS.delete}
                                        confirm={t('layout.work.panel.section.deleteConfirm', {
                                            name: scene.displayTitle
                                        })}
                                        onClick={() => {
                                            tabs.removeTab(scene.id)
                                            return scene.delete()
                                        }}
                                    />
                                </Stack>
                            </Box>
                        }
                    />
                </ListItem>
            ))}
        </List>
    )
}

export default SceneList
