import { Box, Button } from '@mui/material'
import { useRouteLoaderData } from 'react-router-dom'
import { WorkModel } from '@sl/db/models'

const StoryLineBox = () => {
    const work = useRouteLoaderData('work') as WorkModel
    const exportArchive = async () => {
        await work.backup()
    }

    return (
        <Box>
            <Button onClick={exportArchive}>Backup</Button>
        </Box>
    )
}

export default StoryLineBox
