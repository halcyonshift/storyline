import { Box, Stack, Typography } from '@mui/material'

import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import Link from '@sl/components/Link'
import { useTranslation } from 'react-i18next'

const Status404 = () => {
    const { t } = useTranslation()

    return (
        <Box className='text-center'>
            <Typography variant='h4'>{t('error.404.title')}</Typography>
            <Typography variant='body1'>
                <Link href='/' className='text-indigo-400 font-bold'>
                    {t('error.404.link')}
                </Link>
            </Typography>
        </Box>
    )
}

const ErrorBoundary = () => {
    const error = useRouteError()

    return (
        <Box className='grid h-screen place-items-center'>
            <Stack spacing={3}>
                {isRouteErrorResponse(error) && error.status === 404 ? <Status404 /> : null}
                <pre className='text-sm bg-slate-100 p-2'>{JSON.stringify(error, null, 4)}</pre>
            </Stack>
        </Box>
    )
}

export default ErrorBoundary
