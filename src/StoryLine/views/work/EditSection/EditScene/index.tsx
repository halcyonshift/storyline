import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Status from '@sl/components/Status'
import SectionModel from '@sl/db/models/SectionModel'
import SceneForm from '@sl/forms/Work/Section/Scene'

const EditSceneView = ({ scene }: { scene: SectionModel }) => (
    <Box className='p-5'>
        <Box className='px-4 py-2 flex justify-between'>
            <Typography variant='h6'>{scene.displayTitle}</Typography>
            <Status model={scene} />
        </Box>
        <Divider />
        <SceneForm scene={scene} />
    </Box>
)

export default EditSceneView
