import { useEffect, useState, SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Stack from '@mui/material/Stack'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import DateField from '@sl/components/DateField'
import ImageField from '@sl/components/ImageField'
import TextField from '@sl/components/TextField'
import TextareaField from '@sl/components/TextareaField'
import { CharacterDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { CharacterFormProps } from './types'

const CharacterForm = ({
    work,
    character,
    mode,
    initialValues = {
        mode,
        image: '',
        displayName: '',
        description: '',
        history: '',
        pronouns: '',
        firstName: '',
        lastName: '',
        nickname: '',
        nationality: '',
        ethnicity: '',
        placeOfBirth: '',
        residence: '',
        gender: '',
        sexualOrientation: '',
        dateOfBirth: '',
        apparentAge: null,
        religion: '',
        socialClass: '',
        education: '',
        profession: '',
        finances: '',
        politicalLeaning: '',
        face: '',
        build: '',
        height: '',
        weight: '',
        hair: '',
        hairNatural: '',
        distinguishingFeatures: '',
        personalityPositive: '',
        personalityNegative: '',
        ambitions: '',
        fears: ''
    }
}: CharacterFormProps) => {
    const [reRender, setReRender] = useState<boolean>(false)
    const [value, setValue] = useState<string>('1')
    const messenger = useMessenger()
    const { t } = useTranslation()

    useEffect(() => {
        setReRender(true)
        setTimeout(() => setReRender(false), 1)
    }, [character?.id])

    const validationSchema = yup.object({
        image: yup.string().nullable(),
        displayName: yup.string().required(t('form.work.character.displayName.required')),
        description: yup.string().nullable(),
        history: yup.string().nullable(),
        pronouns: yup.string().nullable(),
        firstName: yup.string().nullable(),
        lastName: yup.string().nullable(),
        nickname: yup.string().nullable(),
        nationality: yup.string().nullable(),
        ethnicity: yup.string().nullable(),
        placeOfBirth: yup.string().nullable(),
        residence: yup.string().nullable(),
        gender: yup.string().nullable(),
        sexualOrientation: yup.string().nullable(),
        dateOfBirth: yup.string().nullable(),
        apparentAge: yup.string().nullable(),
        religion: yup.string().nullable(),
        socialClass: yup.string().nullable(),
        education: yup.string().nullable(),
        profession: yup.string().nullable(),
        finances: yup.string().nullable(),
        politicalLeaning: yup.string().nullable(),
        face: yup.string().nullable(),
        build: yup.string().nullable(),
        height: yup.string().nullable(),
        weight: yup.string().nullable(),
        hair: yup.string().nullable(),
        hairNatural: yup.string().nullable(),
        distinguishingFeatures: yup.string().nullable(),
        personalityPositive: yup.string().nullable(),
        personalityNegative: yup.string().nullable(),
        ambitions: yup.string().nullable(),
        fears: yup.string().nullable()
    })

    const form: FormikProps<CharacterDataType> = useFormik<CharacterDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: CharacterDataType) => {
            if (character?.id) {
                await character.updateCharacter(values)
            } else {
                await work.addCharacter(mode, values)
            }
            messenger.success(t('form.work.character.alert.success'))
        }
    })

    const handleTabChange = (event: SyntheticEvent, value: string) => setValue(value)

    if (reRender) return null

    return (
        <form onSubmit={form.handleSubmit} autoComplete='off'>
            <TabContext value={value}>
                <Box className='border-b'>
                    <TabList onChange={handleTabChange} aria-label='lab API tabs example'>
                        <Tab label={t('form.work.character.tab.general')} value='1' />
                        <Tab label={t('form.work.character.tab.demographics')} value='2' />
                        <Tab label={t('form.work.character.tab.appearance')} value='3' />
                        <Tab label={t('form.work.character.tab.about')} value='4' />
                    </TabList>
                </Box>
                <TabPanel value='1'>
                    <Box className='grid grid-cols-2 gap-5'>
                        <Box>
                            <TextField
                                name='pronouns'
                                label={t('form.work.character.pronouns')}
                                form={form}
                            />
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
                            <TextField
                                name='lastName'
                                label={t('form.work.character.lastName')}
                                form={form}
                            />
                            <TextField
                                name='nickname'
                                label={t('form.work.character.nickname')}
                                form={form}
                            />
                        </Box>
                        <TextareaField
                            form={form}
                            fieldName='description'
                            label={t('form.work.character.description')}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value='2'>
                    <Stack spacing={5}>
                        <Box className='grid grid-cols-2 gap-5'>
                            <Box>
                                <TextField
                                    name='nationality'
                                    label={t('form.work.character.nationality')}
                                    form={form}
                                />
                                <TextField
                                    name='ethnicity'
                                    label={t('form.work.character.ethnicity')}
                                    form={form}
                                />
                                <TextField
                                    name='placeOfBirth'
                                    label={t('form.work.character.placeOfBirth')}
                                    form={form}
                                />
                                <TextField
                                    name='residence'
                                    label={t('form.work.character.residence')}
                                    form={form}
                                />
                            </Box>
                            <Box>
                                <DateField
                                    form={form}
                                    label={'form.work.character.dateOfBirth'}
                                    fieldName='dateOfBirth'
                                />
                                <TextField
                                    name='apparentAge'
                                    type='number'
                                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                                    fullWidth={false}
                                    label={t('form.work.character.apparentAge')}
                                    form={form}
                                />
                                <TextField
                                    name='gender'
                                    label={t('form.work.character.gender')}
                                    form={form}
                                />
                                <TextField
                                    name='sexualOrientation'
                                    label={t('form.work.character.sexualOrientation')}
                                    form={form}
                                />
                            </Box>
                        </Box>
                        <Box className='grid grid-cols-2 gap-5'>
                            <Box>
                                <TextField
                                    name='religion'
                                    label={t('form.work.character.religion')}
                                    form={form}
                                />
                                <TextField
                                    name='socialClass'
                                    label={t('form.work.character.socialClass')}
                                    form={form}
                                />
                                <TextField
                                    name='education'
                                    label={t('form.work.character.education')}
                                    form={form}
                                />
                                <TextField
                                    name='profession'
                                    label={t('form.work.character.profession')}
                                    form={form}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    name='finances'
                                    label={t('form.work.character.finances')}
                                    form={form}
                                />
                                <TextField
                                    name='politicalLeaning'
                                    label={t('form.work.character.politicalLeaning')}
                                    form={form}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </TabPanel>
                <TabPanel value='3'>
                    <Box className='grid grid-cols-2 gap-5'>
                        <Box>
                            <TextField
                                name='face'
                                label={t('form.work.character.face')}
                                form={form}
                            />
                            <TextField
                                name='build'
                                label={t('form.work.character.build')}
                                form={form}
                            />
                            <TextField
                                name='height'
                                label={t('form.work.character.height')}
                                form={form}
                            />
                            <TextField
                                name='weight'
                                label={t('form.work.character.weight')}
                                form={form}
                            />
                            <TextField
                                name='hair'
                                label={t('form.work.character.hair')}
                                form={form}
                            />
                            <TextField
                                name='hairNatural'
                                label={t('form.work.character.hairNatural')}
                                form={form}
                            />
                            <TextareaField
                                fieldName='distinguishingFeatures'
                                label={t('form.work.character.distinguishingFeatures')}
                                form={form}
                            />
                        </Box>
                        <Box>
                            <ImageField
                                label={t('form.work.character.image')}
                                form={form}
                                dir='characters'
                            />
                        </Box>
                    </Box>
                </TabPanel>
                <TabPanel value='4'>
                    <Stack spacing={5}>
                        <Box className='grid grid-cols-2 gap-5'>
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
                        <Box className='grid grid-cols-2 gap-5'>
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
                        <TextareaField
                            form={form}
                            fieldName='history'
                            label={t('form.work.character.history')}
                        />
                    </Stack>
                </TabPanel>
            </TabContext>
            <Box className='text-center'>
                <Button type='submit' variant='contained'>
                    {t(
                        character?.id
                            ? 'form.work.character.button.update'
                            : 'form.work.character.button.create'
                    )}
                </Button>
            </Box>
        </form>
    )
}

export default CharacterForm
