import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Status from '@sl/components/Status'
import SectionForm from '@sl/forms/Work/Section'
import { EditPartViewProps } from './types'

const EditPartView = ({ part }: EditPartViewProps) => (
    <Box className='flex flex-col flex-grow'>
        <Box className='flex justify-between h-12 px-3'>
            <Box className='my-auto'>
                <Typography variant='h6'>{part.displayTitle}</Typography>
            </Box>
            <Box className='my-auto'>
                <Status model={part} />
            </Box>
        </Box>
        <Divider />
        <Box className='flex-grow overflow-auto h-0 px-3 py-1'>
            <SectionForm
                section={part}
                initialValues={{
                    title: part.title,
                    description: part.description,
                    wordGoal: part.wordGoal,
                    deadlineAt: part.deadlineAt,
                    order: part.order,
                    date: part.date
                }}
            />
        </Box>
    </Box>
)

export default EditPartView
