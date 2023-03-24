import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Status from '@sl/components/Status'
import SectionForm from '@sl/forms/Work/Section'
import { EditSceneViewProps } from './types'

const EditSceneView = ({ scene }: EditSceneViewProps) => (
    <Box className='flex flex-col flex-grow'>
        <Box className='flex justify-between h-12 px-3'>
            <Box className='my-auto'>
                <Typography variant='h6'>{scene.displayTitle}</Typography>
            </Box>
            <Box className='my-auto'>
                <Status model={scene} />
            </Box>
        </Box>
        <Divider />
        <Box className='flex-grow overflow-auto h-0 px-3 py-1'>
            <SectionForm
                section={scene}
                initialValues={{
                    title: scene.title,
                    description: scene.description,
                    wordGoal: scene.wordGoal,
                    deadlineAt: scene.deadlineAt,
                    order: scene.order,
                    date: scene.date,
                    pointOfView: scene.pointOfView,
                    pointOfViewCharacter: scene.pointOfViewCharacter?.id
                }}
            />
        </Box>
    </Box>
)

export default EditSceneView
