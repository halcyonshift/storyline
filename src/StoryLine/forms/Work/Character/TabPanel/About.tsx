import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import TextareaField from '@sl/components/form/TextareaField'
import { TabPanelProps } from './types'

const AboutPanel = ({ form }: TabPanelProps) => {
    const { t } = useTranslation()

    return (
        <Stack>
            <Box className='grid grid-cols-2 gap-3 px-3 py-1'>
                <Box>
                    <TextareaField
                        fieldName='personalityPositive'
                        label={t('form.work.character.personalityPositive')}
                        form={form}
                    />
                </Box>
                <Box>
                    <TextareaField
                        fieldName='personalityNegative'
                        label={t('form.work.character.personalityNegative')}
                        form={form}
                    />
                </Box>
            </Box>
            <Box className='grid grid-cols-2 gap-3 px-3'>
                <Box>
                    <TextareaField
                        fieldName='ambitions'
                        label={t('form.work.character.ambitions')}
                        form={form}
                    />
                </Box>
                <Box>
                    <TextareaField
                        fieldName='fears'
                        label={t('form.work.character.fears')}
                        form={form}
                    />
                </Box>
            </Box>
            <Box className='pt-1 px-3'>
                <TextareaField
                    form={form}
                    fieldName='history'
                    label={t('form.work.character.history')}
                />
            </Box>
        </Stack>
    )
}

export default AboutPanel