import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Box from '@mui/material/Box'
import { useLoaderData } from 'react-router-dom'

import ListItem from '@sl/components/ListItem'
import { WorkModel } from '@sl/db/models'

const OpenWorkView = () => {
    const works = useLoaderData() as WorkModel[]

    return (
        <Box>
            {works.map((work) => (
                <ListItem
                    key={work.id}
                    link={`/work/${work.id}`}
                    icon={<ArrowRightIcon />}
                    text={work.title}
                />
            ))}
        </Box>
    )
}

export default OpenWorkView
