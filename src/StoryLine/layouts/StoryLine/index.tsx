import { useEffect, useState } from 'react'
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Link from '@sl/components/Link'
import { GLOBAL_ICONS } from '@sl/constants/icons'

import packageJSON from '../../../../package.json'

const StoryLineLayout = () => {
    const [title, setTitle] = useState<string>('')
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => setTitle(location.pathname.replace('/', '')), [location.pathname])
    useEffect(() => {
        api.setTitle(packageJSON.productName)
    }, [])

    return (
        <Box className={`flex flex-col flex-grow`}>
            <AppBar position='static' color='transparent' elevation={0} className='border-b'>
                <Toolbar variant='dense'>
                    <Box>
                        <Tooltip title={t('navigation.back')}>
                            <IconButton
                                id={t('navigation.back')}
                                disabled={!title}
                                edge='start'
                                color='inherit'
                                aria-label={t('navigation.back')}
                                onClick={() => navigate(-1)}>
                                {GLOBAL_ICONS.back}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box className='flex flex-grow justify-between'>
                        <Typography variant='h6'>
                            {title ? t(`view.storyline.landing.navigation.${title}.primary`) : ''}
                        </Typography>
                        <Typography variant='h6'>
                            <Link href='/'>StoryLine</Link>
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box className='flex flex-col flex-grow h-0 overflow-auto'>
                <Outlet />
            </Box>
        </Box>
    )
}

export default StoryLineLayout
