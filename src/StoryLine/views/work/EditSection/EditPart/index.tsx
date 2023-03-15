import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import SectionModel from '@sl/db/models/SectionModel'
import PartForm from '@sl/forms/Work/Section/Part'

const EditPartView = ({ part }: { part: SectionModel }) => (
    <Box className='p-5'>
        <Typography variant='h6'>{part.displayTitle}</Typography>
        <Divider />
        <PartForm part={part} />
    </Box>
)

export default EditPartView
