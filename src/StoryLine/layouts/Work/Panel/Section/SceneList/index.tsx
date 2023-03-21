import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { status } from '@sl/theme/utils'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { dateFormat } from '@sl/utils'

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
                                        <br />
                                        <Tooltip title={t('layout.work.panel.section.updatedAt')}>
                                            <Typography component='span' variant='body2'>
                                                {dateFormat(scene.updatedAt)}
                                            </Typography>
                                        </Tooltip>
                                    </Typography>
                                </ListItemButton>
                                <Box className='flex flex-col justify-center pr-1'>
                                    <Stack spacing={0} direction='row'>
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
                            </Box>
                        }
                    />
                </ListItem>
            ))}
        </List>
    )
}

export default SceneList
