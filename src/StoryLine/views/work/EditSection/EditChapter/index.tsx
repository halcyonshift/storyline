import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import SectionModel from '@sl/db/models/SectionModel'

const EditChapterView = ({ chapter }: { chapter: SectionModel }) => {
    const { t } = useTranslation()

    return (
        <Container className='p-5'>
            <Typography variant='h6'>{chapter.displayTitle}</Typography>
            <Divider />
        </Container>
    )
}

export default EditChapterView
