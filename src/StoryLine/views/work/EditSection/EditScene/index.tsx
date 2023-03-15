import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import SectionModel from '@sl/db/models/SectionModel'
import SceneForm from '@sl/forms/Work/Section/Scene'

const EditSceneView = ({ scene }: { scene: SectionModel }) => (
    <Box className='p-5'>
        <Typography variant='h6'>{scene.displayTitle}</Typography>
        <Divider />
        <SceneForm scene={scene} />
    </Box>
)

export default EditSceneView
