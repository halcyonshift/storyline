import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Status from '@sl/components/Status'
import useTabs from '@sl/layouts/Work/Tabs/useTabs'
import { FormWrapperProps } from './types'

const FormWrapper = ({ title, model, header, children }: FormWrapperProps) => {
    const tabs = useTabs()

    useEffect(() => tabs.setShowTabs(false), [])

    return (
        <Box className='flex flex-col flex-grow'>
            <Box className='px-4 py-2 flex justify-between h-12'>
                <Typography variant='h6'>{title}</Typography>
                <Stack spacing={1} direction='row'>
                    {header}
                    {model ? <Status model={model} /> : null}
                </Stack>
            </Box>
            <Divider />
            <Box className='flex-grow h-0 overflow-auto'>{children}</Box>
        </Box>
    )
}

export default FormWrapper
