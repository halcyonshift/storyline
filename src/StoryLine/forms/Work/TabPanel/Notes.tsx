import { IconButton } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { TabPanelProps } from './types'

const NotesPanel = ({ notes }: TabPanelProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <List>
            {notes.map((note) => (
                <ListItem
                    key={`image-${note.id}`}
                    divider
                    disablePadding
                    disableGutters
                    secondaryAction={
                        <Stack spacing={2} direction='row'>
                            <IconButton
                                onClick={() => {
                                    navigate(
                                        // eslint-disable-next-line max-len
                                        `/works/${note.work.id}/note/${note.id}/edit`
                                    )
                                }}
                                aria-label={t('layout.work.panel.note.edit')}>
                                {GLOBAL_ICONS.edit}
                            </IconButton>
                            <IconButton edge='end' aria-label={t('layout.work.panel.note.delete')}>
                                {GLOBAL_ICONS.delete}
                            </IconButton>
                        </Stack>
                    }>
                    <ListItemButton
                        onClick={() => navigate(`/works/${note.work.id}/note/${note.id}`)}>
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
