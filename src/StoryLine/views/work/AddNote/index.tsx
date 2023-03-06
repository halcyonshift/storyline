import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'

const AddNoteView = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()

    return (
        <Container className='p-5'>
            <Typography variant='h6'>{t('view.work.addNote.title')}</Typography>
            <Divider />
        </Container>
    )
}

export default AddNoteView
