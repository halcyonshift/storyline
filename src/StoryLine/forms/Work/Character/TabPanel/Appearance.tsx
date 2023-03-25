import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import ImageField from '@sl/components/form/ImageField'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { TabPanelProps } from './types'

const AppearancePanel = ({ form }: TabPanelProps) => {
    const { t } = useTranslation()

    return (
        <>
            <Box className='grid grid-cols-2 gap-3 px-3 py-1'>
                <Box>
                    <TextField name='face' label={t('form.work.character.face')} form={form} />
                    <TextField name='build' label={t('form.work.character.build')} form={form} />
                    <TextField name='height' label={t('form.work.character.height')} form={form} />
                    <TextField name='weight' label={t('form.work.character.weight')} form={form} />
                    <TextField name='hair' label={t('form.work.character.hair')} form={form} />
                    <TextField
                        name='hairNatural'
                        label={t('form.work.character.hairNatural')}
                        form={form}
                    />
                </Box>
                <Box className='pt-2'>
                    <ImageField form={form} dir='characters' />
                </Box>
            </Box>
            <Box className='pt-1 px-3'>
                <TextareaField fieldName='distinguishingFeatures' form={form} />
            </Box>
        </>
    )
}

export default AppearancePanel
