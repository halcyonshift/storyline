import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import PartForm from '@sl/forms/Work/Section/Part'
import { EditPartViewProps } from './types'

const EditPartView = ({ part }: EditPartViewProps) => (
    <Box className='p-5'>
        <Typography variant='h6'>{part.displayTitle}</Typography>
        <Divider />
        <PartForm
            part={part}
            initialValues={{
                title: part.title,
                description: part.description || '',
                wordGoal: part.wordGoal,
                deadlineAt: part.deadlineAt,
                order: part.order
            }}
        />
    </Box>
)

export default EditPartView
