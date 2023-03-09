import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useRouteLoaderData } from 'react-router-dom'
import ItemModel from '@sl/db/models/ItemModel'

import ItemForm from '@sl/forms/Work/Item'

const EditItemView = () => {
    const item = useRouteLoaderData('item') as ItemModel

    return (
        <Box className='flex flex-col flex-grow'>
            <Box>
                <Typography variant='h6' className='px-3 py-1'>
                    {item.displayName}
                </Typography>
                <Divider />
            </Box>
            <Box className='flex-grow h-0 overflow-auto p-5'>
                <ItemForm
                    item={item}
                    initialValues={{
                        name: item.name,
                        body: item.body,
                        url: item.url,
                        image: item.image
                    }}
                />
            </Box>
        </Box>
    )
}

export default EditItemView
