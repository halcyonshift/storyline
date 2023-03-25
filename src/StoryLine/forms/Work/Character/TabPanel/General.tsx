import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import TextField from '@sl/components/form/TextField'
import TextareaField from '@sl/components/form/TextareaField'
import { TabPanelProps } from './types'

const GeneralPanel = ({ form }: TabPanelProps) => {
    const { t } = useTranslation()

    return (
        <>
            <Box className='grid grid-cols-2 gap-3 px-3 py-1'>
                <TextField name='pronouns' label={t('form.work.character.pronouns')} form={form} />
                <TextField
                    name='displayName'
                    label={t('form.work.character.displayName.label')}
                    form={form}
                />
                <TextField
                    name='firstName'
                    label={t('form.work.character.firstName')}
                    form={form}
                />
                <TextField name='lastName' label={t('form.work.character.lastName')} form={form} />
                <TextField name='nickname' label={t('form.work.character.nickname')} form={form} />
            </Box>
            <Box className='px-3 pt-2'>
                <TextareaField form={form} fieldName='description' />
            </Box>
        </>
    )
}

export default GeneralPanel
