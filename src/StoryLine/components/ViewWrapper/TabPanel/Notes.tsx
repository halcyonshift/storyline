import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { status, getHex, textColor } from '@sl/theme/utils'
import { NotesPanelProps } from './types'

const NotesPanel = ({ notes }: NotesPanelProps) => {
    const { loadTab } = useTabs()

    return (
        <List disablePadding sx={{ marginLeft: '1px' }}>
            {notes.map((note) => (
                <ListItem
                    key={`note-${note.id}`}
                    divider
                    disablePadding
                    disableGutters
                    sx={{
                        borderLeft: `8px solid ${status(note.status, 500).color}`
                    }}>
                    <ListItemButton
                        sx={
                            note.color
                                ? {
                                      backgroundColor: note.color,
                                      color: textColor(note.color, getHex('white'), getHex('black'))
                                  }
                                : {}
                        }
                        onClick={() => {
                            loadTab({ id: note.id, mode: 'note' })
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
