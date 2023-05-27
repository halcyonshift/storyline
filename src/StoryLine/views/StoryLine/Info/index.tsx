import { Box, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import Icon from '@sl/components/Icon'
import Link from '@sl/components/Link'
import { htmlParse } from '@sl/utils/html'

import packageJSON from '../../../../../package.json'

const InfoView = () => {
    const { t } = useTranslation()

    return (
        <Box className='grid grid-cols-2 gap-3 p-8'>
            <Box>
                <Typography variant='h5'>{t('view.storyline.info.about.title')}</Typography>
                <Stack spacing={1} className='mt-3'>
                    <Box>
                        <Typography variant='body2' className='text-slate-600 dark:text-slate-200'>
                            {t('view.storyline.info.about.version')}
                        </Typography>
                        <Typography variant='body1'>{packageJSON.version}</Typography>
                    </Box>
                    <Box>
                        <Typography variant='body2' className='text-slate-600 dark:text-slate-200'>
                            {t('view.storyline.info.about.developer')}
                        </Typography>
                        <Typography variant='body1'>Hannah O'Malley</Typography>
                    </Box>
                    <Box>
                        <Typography variant='body2' className='text-slate-600 dark:text-slate-200'>
                            {t('view.storyline.info.about.repo')}
                        </Typography>
                        <Link href='https://github.com/halcyonshift/storyline'>
                            <Box className='flex place-items-center'>
                                <Icon name='GitHub' />
                                <Typography variant='body1' className='pl-1'>
                                    halcyonshift/storyline
                                </Typography>
                            </Box>
                        </Link>
                    </Box>
                </Stack>
            </Box>
            <Box>
                <Typography variant='h5'>{t('view.storyline.info.license.title')}</Typography>
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
