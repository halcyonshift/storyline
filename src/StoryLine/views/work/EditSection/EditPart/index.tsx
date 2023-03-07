import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'
import Form from './form'

const AddPartView = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const { t } = useTranslation()

    return (
        <Container className='p-5'>
            <Typography variant='h6'>{t('view.work.addPart.title')}</Typography>
            <Divider />
            <Form work={work} />
        </Container>
    )
}

export default AddPartView
