import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useRouteLoaderData } from 'react-router-dom'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

import NoteForm from '@sl/forms/Work/Note'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'

const AddNoteView = () => {
    const note = useRouteLoaderData('note') as NoteModel
    const work = useRouteLoaderData('work') as WorkModel
    const model = useLoaderData() as CharacterModel | ItemModel | LocationModel | SectionModel
    const { setShowTabs } = useTabs()
    const { t } = useTranslation()

    useEffect(() => setShowTabs(false), [])

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {model ? `${model.displayName}: ` : note ? `${note.title}: ` : null}
                    {t('view.work.addNote.title')}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <NoteForm work={work} note={note} belongsTo={model} />
            </Box>
        </Box>
    )
}

export default AddNoteView
