/* eslint-disable max-len */
import { useState } from 'react'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { Box, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, NOTE_ICONS, SECTION_ICONS } from '@sl/constants/icons'
import { SectionMode } from '@sl/constants/sectionMode'
import { SectionModel } from '@sl/db/models'
import { status, getHex } from '@sl/theme/utils'
import useTabs from '../../Tabs/useTabs'

const Block = ({ section, index }: { section: SectionModel; index: number }) => {
    const [show, setShow] = useState<boolean>(false)
    const children = useObservable(
        () =>
            section.sections
                .extend(Q.where('mode', Q.notEq(SectionMode.VERSION)))
                .observeWithColumns(['title', 'status']),
        [],
        []
    )
    const navigate = useNavigate()
    const { loadTab } = useTabs()
    const { t } = useTranslation()

    return (
        <Draggable draggableId={section.id} index={index}>
            {(provided) => (
                <List
                    dense
                    disablePadding
                    className='bg-white'
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <ListItem
                        {...provided.dragHandleProps}
                        title={section.displayTitle}
                        disablePadding
                        disableGutters
                        divider>
                        <ListItemText
                            primary={
                                <Box
                                    className='flex flex-grow pr-1'
                                    sx={{
                                        backgroundColor: status(
                                            section.status,
                                            section.isPart ? 600 : section.isChapter ? 200 : 50
                                        ).color,
                                        color: section.isPart ? getHex('white') : 'inherit'
                                    }}>
                                    <ListItemButton
                                        onClick={() =>
                                            section.isScene
                                                ? loadTab({
                                                      id: section.id,
                                                      label: section.displayTitle,
                                                      link: `section/${section.id}`
                                                  })
                                                : setShow(!show)
                                        }>
                                        <Typography
                                            title={section.displayTitle}
                                            variant='body1'
                                            className='flex-grow w-0 whitespace-nowrap text-ellipsis
                                                        overflow-hidden self-center'>
                                            {section.displayTitle}
                                        </Typography>
                                    </ListItemButton>

                                    <Stack direction='row'>
                                        {section.isPart ? (
                                            <TooltipIconButton
                                                size='small'
                                                text='layout.work.panel.section.addChapter'
                                                icon={SECTION_ICONS.addChapter}
                                                onClick={() => {
                                                    section.addChapter()
                                                }}
                                            />
                                        ) : section.isChapter ? (
                                            <TooltipIconButton
                                                size='small'
                                                text='layout.work.panel.section.addScene'
                                                icon={SECTION_ICONS.addScene}
                                                onClick={() => {
                                                    section.addScene()
                                                }}
                                            />
                                        ) : null}
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.add'
                                            link={`addNote/section/${section.id}`}
                                            icon={NOTE_ICONS.add}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.section.edit'
                                            link={`section/${section.id}/edit`}
                                            icon={GLOBAL_ICONS.edit}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.section.delete'
                                            icon={GLOBAL_ICONS.delete}
                                            confirm={t('layout.work.panel.section.deleteConfirm', {
                                                name: section.displayTitle
                                            })}
                                            onClick={async () => {
                                                await section.delete()
                                                navigate(`/work/${section.work.id}`)
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            }
                        />
                    </ListItem>
                    {children.length && show ? (
                        <Droppable droppableId={section.id} type={section.mode}>
                            {(provided) => (
                                <Box ref={provided.innerRef} {...provided.droppableProps}>
                                    {children.map((section, index) => (
                                        <Block key={section.id} section={section} index={index} />
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    ) : null}
                </List>
            )}
        </Draggable>
    )
}

export default Block
