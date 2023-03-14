import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import SectionModel from '@sl/db/models/SectionModel'

import PartForm from '@sl/forms/Work/Section/Part'
const EditPartView = ({ part }: { part: SectionModel }) => {
    return (
        <Container className='p-5'>
            <Typography variant='h6'>{part.displayTitle}</Typography>
            <Divider />
            <PartForm part={part} />
        </Container>
    )
}

export default EditPartView
