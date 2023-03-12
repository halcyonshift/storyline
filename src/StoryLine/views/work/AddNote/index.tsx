import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { NoteModel, WorkModel } from '@sl/db/models'

import NoteForm from '@sl/forms/Work/Note'

const AddNoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {note ? `${note.title}: ` : null}
                    {t('view.work.addNote.title')}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <NoteForm work={work} note={note} />
            </Box>
        </Box>
    )
}

export default AddNoteView
