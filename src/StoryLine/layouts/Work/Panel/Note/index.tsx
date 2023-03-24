import { useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { useObservable } from 'rxjs-hooks'
import Panel from '@sl/components/Panel'
import GroupToggle from '@sl/components/Panel/GroupToggle'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { WorkModel } from '@sl/db/models'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const NotePanel = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const [group, setGroup] = useState<boolean>(false)
    const { t } = useTranslation()
    const { loadTab, removeTab } = useTabs()
    const notes = useObservable(
        () =>
            work.note
                .extend(Q.sortBy('order', Q.asc))
                .observeWithColumns(['title', 'status', 'order']),
        [],
        []
    )
    return (
        <Panel
            action={<GroupToggle group={group} setGroup={setGroup} />}
            navigation={[
                { link: 'addNote', text: 'layout.work.panel.note.add', icon: NOTE_ICONS.add }
            ]}>
            <List dense disablePadding>
                {notes.map((note) => (
                    <ListItem key={note.id} disablePadding disableGutters divider>
                        <ListItemText
                            primary={
                                <Box className='flex justify-between align-middle'>
                                    <ListItemButton
                                        onClick={() =>
                                            loadTab({
                                                id: note.id,
                                                label: note.title,
                                                link: `note/${note.id}`
                                            })
                                        }>
                                        <Typography
                                            variant='body1'
                                            className='whitespace-nowrap text-ellipsis
                                            overflow-hidden'>
                                            {note.title}
                                        </Typography>
                                    </ListItemButton>
                                    <Stack spacing={0} direction='row'>
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.add'
                                            icon={NOTE_ICONS.add}
                                            link={`note/${note.id}/add`}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.edit'
                                            link={`note/${note.id}/edit`}
                                            icon={GLOBAL_ICONS.edit}
                                        />
                                        <TooltipIconButton
                                            size='small'
                                            text='layout.work.panel.note.delete'
                                            icon={GLOBAL_ICONS.delete}
                                            confirm={t('layout.work.panel.note.deleteConfirm', {
                                                name: note.title
                                            })}
                                            onClick={() => {
                                                removeTab(note.id)
                                                return note.delete()
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Panel>
    )
}

export default NotePanel
