import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import DateField from '@sl/components/form/DateField'
import TextField from '@sl/components/form/TextField'
import { TabPanelProps } from './types'

const DemographicsPanel = ({ form }: TabPanelProps) => {
    const { t } = useTranslation()

    return (
        <Box className='grid grid-cols-2 gap-3 pt-3'>
            <TextField
                name='nationality'
                label={t('form.work.character.nationality')}
                form={form}
            />
            <TextField name='ethnicity' label={t('form.work.character.ethnicity')} form={form} />
            <TextField
                name='placeOfBirth'
                label={t('form.work.character.placeOfBirth')}
                form={form}
            />
            <TextField name='residence' label={t('form.work.character.residence')} form={form} />
            <Box className='w-1/2'>
                <DateField
                    form={form}
                    label={'form.work.character.dateOfBirth'}
                    fieldName='dateOfBirth'
                />
            </Box>
            <Box>
                <TextField
                    name='apparentAge'
                    label={t('form.work.character.apparentAge')}
                    form={form}
                />
            </Box>
            <TextField name='gender' label={t('form.work.character.gender')} form={form} />
            <TextField
                name='sexualOrientation'
                label={t('form.work.character.sexualOrientation')}
                form={form}
            />
            <TextField name='religion' label={t('form.work.character.religion')} form={form} />
            <TextField
                name='socialClass'
                label={t('form.work.character.socialClass')}
                form={form}
            />
            <TextField name='education' label={t('form.work.character.education')} form={form} />
            <TextField name='profession' label={t('form.work.character.profession')} form={form} />
            <TextField name='finances' label={t('form.work.character.finances')} form={form} />
            <TextField
                name='politicalLeaning'
                label={t('form.work.character.politicalLeaning')}
                form={form}
            />
        </Box>
    )
}

export default DemographicsPanel
