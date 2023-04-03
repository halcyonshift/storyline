import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { status } from '@sl/theme/utils'
import { TabPanelProps } from './types'

const NotesPanel = ({ notes }: TabPanelProps) => {
    const { loadTab } = useTabs()
    const { t } = useTranslation()

    return (
        <List disablePadding sx={{ marginLeft: '1px' }}>
            {notes.map((note) => (
                <ListItem
                    key={`note-${note.id}`}
                    divider
                    disablePadding
                    disableGutters
                    sx={{
                        borderLeft: `8px solid ${note.color || status(note.status, 50).color}`,
                        backgroundColor: status(note.status, 50).color
                    }}
                    secondaryAction={
                        <Stack spacing={0} direction='row' className='mr-3'>
                            <TooltipIconButton
                                size='small'
                                text='layout.work.panel.note.edit'
                                link={`/work/${note.work.id}/note/${note.id}/edit`}
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
                                    note.delete()
                                }}
                            />
                        </Stack>
                    }>
                    <ListItemButton
                        onClick={() => {
                            loadTab({
                                id: note.id,
                                label: note.displayName,
                                link: `note/${note.id}`
                            })
                        }}>
                        <ListItemText
                            primary={note.displayName}
                            secondary={note.date ? note.displayDate : null}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default NotesPanel
