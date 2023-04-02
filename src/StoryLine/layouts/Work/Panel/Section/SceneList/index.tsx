/* eslint-disable max-len */
import { Box, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { GLOBAL_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { status } from '@sl/theme/utils'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { SceneListProps } from '../types'

const SceneList = ({ scenes }: SceneListProps) => {
    const tabs = useTabs()
    const { t } = useTranslation()

    return scenes.length ? (
        <Droppable
            droppableId={`sceneList-${scenes[0].section.id}`}
            type={`${scenes[0].section.id}-SCENES`}>
            {(provided) => (
                <List
                    dense
                    disablePadding
                    className='bg-white'
                    {...provided.droppableProps}
                    ref={provided.innerRef}>
                    {scenes.map((scene, index) => (
                        <Draggable key={scene.id} draggableId={scene.id} index={index}>
                            {(provided) => (
                                <ListItem
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    title={scene.displayTitle}
                                    disablePadding
                                    disableGutters
                                    divider>
                                    <ListItemText
                                        primary={
                                            <Box
                                                className='flex justify-between align-middle'
                                                sx={{
                                                    backgroundColor: status(scene.status).color
                                                }}>
                                                <ListItemButton
                                                    onClick={() =>
                                                        tabs.loadTab({
                                                            id: scene.id,
                                                            label: scene.displayTitle,
                                                            link: `section/${scene.id}`
                                                        })
                                                    }>
                                                    <Typography
                                                        title={scene.displayTitle}
                                                        variant='body1'
                                                        className='whitespace-nowrap text-ellipsis
                                                    overflow-hidden'>
                                                        {scene.displayTitle}
                                                    </Typography>
                                                </ListItemButton>
                                                <Box className='flex flex-col justify-center pr-1'>
                                                    <Stack spacing={0} direction='row'>
                                                        <TooltipIconButton
                                                            size='small'
                                                            text='layout.work.panel.note.add'
                                                            link={`addNote/section/${scene.id}`}
                                                            icon={NOTE_ICONS.add}
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
                                                            confirm={t(
                                                                // eslint-disable-next-line max-len
                                                                'layout.work.panel.section.deleteConfirm',
                                                                {
                                                                    name: scene.displayTitle
                                                                }
                                                            )}
                                                            onClick={() => {
                                                                tabs.removeTab(scene.id)
                                                                scene.delete()
                                                            }}
                                                        />
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </List>
            )}
        </Droppable>
    ) : null
}

export default SceneList
