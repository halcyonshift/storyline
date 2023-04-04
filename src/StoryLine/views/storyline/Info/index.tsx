import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const InfoView = () => {
    const { t } = useTranslation()

    return (
        <Box>
            <Typography variant='h4'>{t('view.storyline.info.about.title')}</Typography>
        </Box>
    )
}

export default InfoView