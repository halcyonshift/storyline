import { Box, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { htmlParse } from '@sl/utils'

const InfoView = () => {
    const { t } = useTranslation()

    return (
        <Box className='grid grid-cols-2 gap-3'>
            <Box>
                <Typography variant='h6'>{t('view.storyline.info.about.title')}</Typography>
                <Stack spacing={1} className='mt-3'>
                    <Box>
                        <Typography variant='body2' className='text-slate-600'>
                            {t('view.storyline.info.about.version')}
                        </Typography>
                        <Typography variant='body1'>{process.env.VERSION}</Typography>
                    </Box>
                    <Box>
                        <Typography variant='body2' className='text-slate-600'>
                            {t('view.storyline.info.about.developer')}
                        </Typography>
                        <Typography variant='body1'>Hannah O'Malley</Typography>
                    </Box>
                </Stack>
            </Box>
            <Box>
                <Typography variant='h6'>{t('view.storyline.info.license.title')}</Typography>
                <Typography variant='body1' className='pt-3'>
                    {t('view.storyline.info.license.text')}
                </Typography>
                <Typography variant='body1'>
                    {t('view.storyline.info.license.copyright', {
                        symbol: htmlParse('&copy;'),
                        year: DateTime.now().toFormat('yyyy')
                    })}
                </Typography>
                <Typography variant='body2' className='pt-2 pb-1'>
                    {t('view.storyline.info.license.notice1')}
                </Typography>
                <Typography variant='body2'>{t('view.storyline.info.license.notice2')}</Typography>
            </Box>
        </Box>
    )
}

export default InfoView
