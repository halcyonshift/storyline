import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Status from '@sl/components/Status'
import SceneForm from '@sl/forms/Work/Section/Scene'
import { EditSceneViewProps } from './types'

const EditSceneView = ({ scene }: EditSceneViewProps) => (
    <Box className='p-5'>
        <Box className='px-4 py-2 flex justify-between'>
            <Typography variant='h6'>{scene.displayTitle}</Typography>
            <Status model={scene} />
        </Box>
        <Divider />
        <SceneForm
            scene={scene}
            initialValues={{
                title: scene.title || '',
                description: scene.description || '',
                wordGoal: scene.wordGoal,
                deadlineAt: scene.deadlineAt,
                order: scene.order,
                date: scene.date
            }}
        />
    </Box>
)

export default EditSceneView
