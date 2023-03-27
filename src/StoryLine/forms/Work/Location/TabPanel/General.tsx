import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import ImageField from '@sl/components/form/ImageField'
import MapField from '@sl/components/form/MapField'
import TextField from '@sl/components/form/TextField'
import TextareaField from '@sl/components/form/TextareaField'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import { TabPanelProps } from './types'

const GeneralPanel = ({ form }: TabPanelProps) => {
    const isOnline = useOnlineStatus()
    const { t } = useTranslation()

    return (
        <>
            {!isOnline ? <Alert severity='warning'>{t('error.connection')}</Alert> : null}
            <TextField
                autoFocus
                label={t('form.work.location.name.label')}
                name='name'
                form={form}
            />
            <TextField label={t('form.work.location.url')} name='url' form={form} />
            <Box className='grid grid-cols-2 gap-3'>
                <Box>
                    <MapField form={form} />
                </Box>
                <Box>
                    <ImageField form={form} dir='locations' />
                </Box>
            </Box>
            <TextareaField fieldName='body' form={form}></TextareaField>
        </>
    )
}

export default GeneralPanel
