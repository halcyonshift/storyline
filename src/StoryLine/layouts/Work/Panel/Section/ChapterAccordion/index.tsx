/* eslint-disable max-len */
import { Box, Stack, Typography } from '@mui/material'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { GLOBAL_ICONS, NOTE_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import Accordion from '@sl/components/Accordion'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import SceneList from '../SceneList'
import { ChapterAccordionProps } from '../types'

const ChapterAccordion = ({ chapters, scenes }: ChapterAccordionProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return chapters.length ? (
        <Droppable
            droppableId={`rbd-part-${chapters[0].section.id}-chapters`}
            type={`${chapters[0].section.id}-CHAPTERS`}>
            {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                    {chapters.map((chapter, index) => (
                        <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                            {(provided) => (
                                <Box {...provided.draggableProps} ref={provided.innerRef}>
                                    <Accordion
                                        key={chapter.id}
                                        className='p-1 border-b'
                                        title={
                                            <Box
                                                className='flex flex-grow'
                                                {...provided.dragHandleProps}>
                                                <Typography
                                                    variant='body1'
                                                    className='flex-grow w-0 whitespace-nowrap text-ellipsis overflow-hidden self-center'>
                                                    {chapter.displayTitle}
                                                </Typography>
                                                <Stack spacing={0} direction='row'>
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.section.addScene'
                                                        icon={SECTION_ICONS.addScene}
                                                        onClick={() => {
                                                            chapter.addScene()
                                                        }}
                                                    />
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.note.add'
                                                        link={`addNote/section/${chapter.id}`}
                                                        icon={NOTE_ICONS.add}
                                                    />
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.section.edit'
                                                        link={`section/${chapter.id}/edit`}
                                                        icon={GLOBAL_ICONS.edit}
                                                    />
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.section.delete'
                                                        icon={GLOBAL_ICONS.delete}
                                                        confirm={t(
                                                            'layout.work.panel.section.deleteConfirm',
                                                            {
                                                                name: chapter.displayTitle
                                                            }
                                                        )}
                                                        onClick={async () => {
                                                            await chapter.delete()
                                                            navigate(`/works/${chapter.work.id}`)
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                        }>
                                        <SceneList
                                            scenes={scenes.filter(
                                                (scene) => scene.section.id === chapter.id
                                            )}
                                        />
                                    </Accordion>
                                </Box>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </Box>
            )}
        </Droppable>
    ) : null
}

export default ChapterAccordion
