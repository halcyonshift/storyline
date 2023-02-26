/** @format */
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'

const StoryLineLayout = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Box className={`flex flex-col flex-grow bg-white dark:bg-slate-800`}>
            <AppBar position='static' color='default'>
                <Toolbar variant='dense' className='justify-between'>
                    <Box>
                        <IconButton
                            className='flex-col'
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='back'
                            onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                            <Typography variant='body2'>{t('navigation.back')}</Typography>
                        </IconButton>
                    </Box>
                    <Typography variant='h6'>StoryLine</Typography>
                </Toolbar>
            </AppBar>
            <Box className='flex flex-col flex-grow'>
                <Outlet />
            </Box>
        </Box>
    )
}

export default StoryLineLayout
