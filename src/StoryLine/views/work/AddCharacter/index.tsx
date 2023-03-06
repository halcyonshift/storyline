import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useParams, useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'

const AddCharacterView = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const work = useRouteLoaderData('work') as WorkModel
    const params = useParams()
    const { t } = useTranslation()

    return (
        <Container className='p-5'>
            <Typography variant='h6'>
                {t('view.work.addCharacter.title', {
                    mode: t(`model.character.${params.mode}`).toLowerCase()
                })}
            </Typography>
            <Divider />
        </Container>
    )
}

export default AddCharacterView
