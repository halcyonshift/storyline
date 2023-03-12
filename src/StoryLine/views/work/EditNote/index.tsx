import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useRouteLoaderData } from 'react-router-dom'
import { NoteModel } from '@sl/db/models'

import NoteForm from '@sl/forms/Work/Note'

const EditNoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {note.title}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <NoteForm
                    note={note}
                    initialValues={{
                        title: note.title,
                        body: note.body,
                        url: note.url,
                        date: note.date,
                        color: note.color,
                        image: note.image
                    }}
                />
            </Box>
        </Box>
    )
}

export default EditNoteView
