import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import SectionModel from '@sl/db/models/SectionModel'
import SceneForm from '@sl/forms/Work/Section/Scene'

const EditSceneView = ({ scene }: { scene: SectionModel }) => (
    <Container className='p-5'>
        <Typography variant='h6'>{scene.displayTitle}</Typography>
        <Divider />
        <SceneForm scene={scene} />
    </Container>
)

export default EditSceneView
