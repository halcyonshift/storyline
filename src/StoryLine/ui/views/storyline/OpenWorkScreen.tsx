import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Box from '@mui/material/Box'
import { useLoaderData } from 'react-router-dom'

import ListItem from '../../components/ListItem'
import { WorkModel } from '../../../db/models'

const OpenWorkScreen = () => {
    const works = useLoaderData() as WorkModel[]

    return (
        <Box>
            {works.map((work) => (
                <ListItem
                    key={work.id}
                    link={`/works/${work.id}`}
                    icon={<ArrowRightIcon />}
                    text={work.title}
                />
            ))}
        </Box>
    )
}

export default OpenWorkScreen
