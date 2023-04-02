/* eslint-disable max-len */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Accordion from '@sl/components/Accordion'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, NOTE_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import useSettings from '@sl/theme/useSettings'
import ChapterAccordion from '../ChapterAccordion'
import { PartAccordionProps } from '../types'

const PartAccordion = ({ parts, chapters, scenes }: PartAccordionProps) => {
    const navigate = useNavigate()
    const settings = useSettings()
    const { t } = useTranslation()

    return (
        <Droppable droppableId='rbd-parts'>
            {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                    {parts.map((part, index) => (
                        <Draggable key={part.id} draggableId={part.id} index={index}>
                            {(provided) => (
                                <Box {...provided.draggableProps} ref={provided.innerRef}>
                                    <Accordion
                                        title={
                                            <Box
                                                className='flex flex-grow'
                                                {...provided.dragHandleProps}>
                                                <Typography
                                                    variant='body1'
                                                    className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                            overflow-hidden self-center'>
                                                    {part.displayTitle}
                                                </Typography>
                                                <Stack direction='row'>
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.section.addChapter'
                                                        icon={SECTION_ICONS.addChapter}
                                                        onClick={() => {
                                                            part.addChapter()
                                                        }}
                                                    />
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.note.add'
                                                        link={`addNote/section/${part.id}`}
                                                        icon={NOTE_ICONS.add}
                                                    />
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.section.edit'
                                                        link={`section/${part.id}/edit`}
                                                        icon={GLOBAL_ICONS.edit}
                                                    />
                                                    <TooltipIconButton
                                                        size='small'
                                                        text='layout.work.panel.section.delete'
                                                        icon={GLOBAL_ICONS.delete}
                                                        confirm={t(
                                                            'layout.work.panel.section.deleteConfirm',
                                                            {
                                                                name: part.displayTitle
                                                            }
                                                        )}
                                                        onClick={async () => {
                                                            await part.delete()
                                                            navigate(`/works/${part.work.id}`)
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                        }
                                        sx={{ backgroundColor: settings.getHex(400) }}
                                        className='text-white p-1 border-b'>
                                        <ChapterAccordion
                                            chapters={chapters.filter(
                                                (chapter) => chapter.section.id === part.id
                                            )}
                                            scenes={scenes}
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
    )
}

export default PartAccordion
