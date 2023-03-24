import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Status from '@sl/components/Status'
import SectionForm from '@sl/forms/Work/Section'
import { EditChapterViewProps } from './types'

const EditChapterView = ({ chapter }: EditChapterViewProps) => (
    <Box className='flex flex-col flex-grow'>
        <Box className='flex justify-between h-12 px-3'>
            <Box className='my-auto'>
                <Typography variant='h6'>{chapter.displayTitle}</Typography>
            </Box>
            <Box className='my-auto'>
                <Status model={chapter} />
            </Box>
        </Box>
        <Divider />
        <Box className='flex-grow overflow-auto h-0 px-3 py-1'>
            <SectionForm
                section={chapter}
                initialValues={{
                    title: chapter.title,
                    description: chapter.description,
                    wordGoal: chapter.wordGoal,
                    deadlineAt: chapter.deadlineAt,
                    order: chapter.order,
                    date: chapter.date
                }}
            />
        </Box>
    </Box>
)

export default EditChapterView
