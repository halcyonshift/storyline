import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

import Link from '@sl/components/Link'
import { useSettings } from '@sl/theme'

const Status404 = () => {
    const { t } = useTranslation()
    const settings = useSettings()

    return (
        <Box className='text-center'>
            <Typography variant='h4'>{t('error.404.title')}</Typography>
            <Typography variant='body1'>
                <Link href='/' className={`text-${settings.palette}-400 font-bold`}>
                    {t('error.404.link')}
                </Link>
            </Typography>
        </Box>
    )
}

const Status500 = () => {
    const { t } = useTranslation()
    const settings = useSettings()

    return (
        <Box className='text-center'>
            <Typography variant='h4'>{t('error.500.title')}</Typography>
            <Typography variant='body1'>
                <Link href='/' className={`text-${settings.palette}-400 font-bold`}>
                    {t('error.500.link')}
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
                {isRouteErrorResponse(error) && error.status === 404 ? (
                    <Status404 />
                ) : (
                    <Status500 />
                )}
                <pre className='text-sm bg-slate-100 p-2'>{JSON.stringify(error, null, 4)}</pre>
            </Stack>
        </Box>
    )
}

export default ErrorBoundary
