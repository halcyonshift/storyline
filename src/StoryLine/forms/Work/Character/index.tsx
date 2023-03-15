import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import DateField from '@sl/components/DateField'
import { CharacterDataType } from '@sl/db/models/types'
import { CharacterFormProps } from './types'
import ImageField from '@sl/components/ImageField'
import TextareaField from '@sl/components/TextareaField'

// eslint-disable-next-line complexity
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
    const { t } = useTranslation()
    const [open, setOpen] = useState<boolean>(false)
    const [reRender, setReRender] = useState<boolean>(false)

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
            setOpen(true)
        }
    })

    if (reRender) return null

    return (
        <Stack component={'form'} spacing={5} onSubmit={form.handleSubmit} autoComplete='off'>
            <Box className='grid grid-cols-2 gap-5'>
                <Box>
                    <ImageField
                        label={t('form.work.character.image')}
                        form={form}
                        dir='characters'
                    />
                </Box>
                <Box>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='pronouns'
                        label={t('form.work.character.pronouns')}
                        name='pronouns'
                        fullWidth
                        variant='standard'
                        value={form.values.pronouns}
                        onChange={form.handleChange}
                        error={form.touched.pronouns && Boolean(form.errors.pronouns)}
                        helperText={form.touched.pronouns && form.errors.pronouns}
                    />
                    <TextField
                        margin='dense'
                        id='displayName'
                        label={t('form.work.character.displayName.label')}
                        name='displayName'
                        fullWidth
                        variant='standard'
                        value={form.values.displayName}
                        onChange={form.handleChange}
                        error={form.touched.displayName && Boolean(form.errors.displayName)}
                        helperText={form.touched.displayName && form.errors.displayName}
                    />
                    <TextField
                        margin='dense'
                        id='firstName'
                        label={t('form.work.character.firstName')}
                        name='firstName'
                        fullWidth
                        variant='standard'
                        value={form.values.firstName}
                        onChange={form.handleChange}
                        error={form.touched.firstName && Boolean(form.errors.firstName)}
                        helperText={form.touched.firstName && form.errors.firstName}
                    />
                    <TextField
                        margin='dense'
                        id='lastName'
                        label={t('form.work.character.lastName')}
                        name='lastName'
                        fullWidth
                        variant='standard'
                        value={form.values.lastName}
                        onChange={form.handleChange}
                        error={form.touched.lastName && Boolean(form.errors.lastName)}
                        helperText={form.touched.lastName && form.errors.lastName}
                    />
                    <TextField
                        margin='dense'
                        id='nickname'
                        label={t('form.work.character.nickname')}
                        name='nickname'
                        fullWidth
                        variant='standard'
                        value={form.values.nickname}
                        onChange={form.handleChange}
                        error={form.touched.nickname && Boolean(form.errors.nickname)}
                        helperText={form.touched.nickname && form.errors.nickname}
                    />
                </Box>
            </Box>
            <TextareaField
                form={form}
                fieldName='description'
                label={t('form.work.character.description')}
            />
            <Box className='grid grid-cols-2 gap-5'>
                <Box>
                    <TextField
                        margin='dense'
                        id='nationality'
                        label={t('form.work.character.nationality')}
                        name='nationality'
                        fullWidth
                        variant='standard'
                        value={form.values.nationality}
                        onChange={form.handleChange}
                        error={form.touched.nationality && Boolean(form.errors.nationality)}
                        helperText={form.touched.nationality && form.errors.nationality}
                    />
                    <TextField
                        margin='dense'
                        id='ethnicity'
                        label={t('form.work.character.ethnicity')}
                        name='ethnicity'
                        fullWidth
                        variant='standard'
                        value={form.values.ethnicity}
                        onChange={form.handleChange}
                        error={form.touched.ethnicity && Boolean(form.errors.ethnicity)}
                        helperText={form.touched.ethnicity && form.errors.ethnicity}
                    />
                    <TextField
                        margin='dense'
                        id='placeOfBirth'
                        label={t('form.work.character.placeOfBirth')}
                        name='placeOfBirth'
                        fullWidth
                        variant='standard'
                        value={form.values.placeOfBirth}
                        onChange={form.handleChange}
                        error={form.touched.placeOfBirth && Boolean(form.errors.placeOfBirth)}
                        helperText={form.touched.placeOfBirth && form.errors.placeOfBirth}
                    />
                    <TextField
                        margin='dense'
                        id='residence'
                        label={t('form.work.character.residence')}
                        name='residence'
                        fullWidth
                        variant='standard'
                        value={form.values.residence}
                        onChange={form.handleChange}
                        error={form.touched.residence && Boolean(form.errors.residence)}
                        helperText={form.touched.residence && form.errors.residence}
                    />
                </Box>
                <Box>
                    <DateField
                        form={form}
                        label={'form.work.character.dateOfBirth'}
                        fieldName='dateOfBirth'
                    />
                    <TextField
                        margin='dense'
                        id='apparentAge'
                        label={t('form.work.character.apparentAge')}
                        name='apparentAge'
                        fullWidth
                        variant='standard'
                        value={form.values.apparentAge}
                        onChange={form.handleChange}
                        error={form.touched.apparentAge && Boolean(form.errors.apparentAge)}
                        helperText={form.touched.apparentAge && form.errors.apparentAge}
                    />
                    <TextField
                        margin='dense'
                        id='gender'
                        label={t('form.work.character.gender')}
                        name='gender'
                        fullWidth
                        variant='standard'
                        value={form.values.gender}
                        onChange={form.handleChange}
                        error={form.touched.gender && Boolean(form.errors.gender)}
                        helperText={form.touched.gender && form.errors.gender}
                    />
                    <TextField
                        margin='dense'
                        id='sexualOrientation'
                        label={t('form.work.character.sexualOrientation')}
                        name='sexualOrientation'
                        fullWidth
                        variant='standard'
                        value={form.values.sexualOrientation}
                        onChange={form.handleChange}
                        error={
                            form.touched.sexualOrientation && Boolean(form.errors.sexualOrientation)
                        }
                        helperText={form.touched.sexualOrientation && form.errors.sexualOrientation}
                    />
                </Box>
            </Box>
            <Box className='grid grid-cols-2 gap-5'>
                <Box>
                    <TextField
                        margin='dense'
                        id='religion'
                        label={t('form.work.character.religion')}
                        name='religion'
                        fullWidth
                        variant='standard'
                        value={form.values.religion}
                        onChange={form.handleChange}
                        error={form.touched.religion && Boolean(form.errors.religion)}
                        helperText={form.touched.religion && form.errors.religion}
                    />
                    <TextField
                        margin='dense'
                        id='socialClass'
                        label={t('form.work.character.socialClass')}
                        name='socialClass'
                        fullWidth
                        variant='standard'
                        value={form.values.socialClass}
                        onChange={form.handleChange}
                        error={form.touched.socialClass && Boolean(form.errors.socialClass)}
                        helperText={form.touched.socialClass && form.errors.socialClass}
                    />
                    <TextField
                        margin='dense'
                        id='education'
                        label={t('form.work.character.education')}
                        name='education'
                        fullWidth
                        variant='standard'
                        value={form.values.education}
                        onChange={form.handleChange}
                        error={form.touched.education && Boolean(form.errors.education)}
                        helperText={form.touched.education && form.errors.education}
                    />
                    <TextField
                        margin='dense'
                        id='profession'
                        label={t('form.work.character.profession')}
                        name='profession'
                        fullWidth
                        variant='standard'
                        value={form.values.profession}
                        onChange={form.handleChange}
                        error={form.touched.profession && Boolean(form.errors.profession)}
                        helperText={form.touched.profession && form.errors.profession}
                    />
                </Box>
                <Box>
                    <TextField
                        margin='dense'
                        id='finances'
                        label={t('form.work.character.finances')}
                        name='finances'
                        fullWidth
                        variant='standard'
                        value={form.values.finances}
                        onChange={form.handleChange}
                        error={form.touched.finances && Boolean(form.errors.finances)}
                        helperText={form.touched.finances && form.errors.finances}
                    />
                    <TextField
                        margin='dense'
                        id='politicalLeaning'
                        label={t('form.work.character.politicalLeaning')}
                        name='politicalLeaning'
                        fullWidth
                        variant='standard'
                        value={form.values.politicalLeaning}
                        onChange={form.handleChange}
                        error={
                            form.touched.politicalLeaning && Boolean(form.errors.politicalLeaning)
                        }
                        helperText={form.touched.politicalLeaning && form.errors.politicalLeaning}
                    />
                </Box>
            </Box>
            <Box className='grid grid-cols-2 gap-5'>
                <Box>
                    <TextField
                        margin='dense'
                        id='face'
                        label={t('form.work.character.face')}
                        name='face'
                        fullWidth
                        variant='standard'
                        value={form.values.face}
                        onChange={form.handleChange}
                        error={form.touched.face && Boolean(form.errors.face)}
                        helperText={form.touched.face && form.errors.face}
                    />
                    <TextField
                        margin='dense'
                        id='build'
                        label={t('form.work.character.build')}
                        name='build'
                        fullWidth
                        variant='standard'
                        value={form.values.build}
                        onChange={form.handleChange}
                        error={form.touched.build && Boolean(form.errors.build)}
                        helperText={form.touched.build && form.errors.build}
                    />
                    <TextField
                        margin='dense'
                        id='height'
                        label={t('form.work.character.height')}
                        name='height'
                        fullWidth
                        variant='standard'
                        value={form.values.height}
                        onChange={form.handleChange}
                        error={form.touched.height && Boolean(form.errors.height)}
                        helperText={form.touched.height && form.errors.height}
                    />
                    <TextField
                        margin='dense'
                        id='weight'
                        label={t('form.work.character.weight')}
                        name='weight'
                        fullWidth
                        variant='standard'
                        value={form.values.weight}
                        onChange={form.handleChange}
                        error={form.touched.weight && Boolean(form.errors.weight)}
                        helperText={form.touched.weight && form.errors.weight}
                    />
                    <TextField
                        margin='dense'
                        id='hair'
                        label={t('form.work.character.hair')}
                        name='hair'
                        fullWidth
                        variant='standard'
                        value={form.values.hair}
                        onChange={form.handleChange}
                        error={form.touched.hair && Boolean(form.errors.hair)}
                        helperText={form.touched.hair && form.errors.hair}
                    />
                    <TextField
                        margin='dense'
                        id='hairNatural'
                        label={t('form.work.character.hairNatural')}
                        name='hairNatural'
                        fullWidth
                        variant='standard'
                        value={form.values.hairNatural}
                        onChange={form.handleChange}
                        error={form.touched.hairNatural && Boolean(form.errors.hairNatural)}
                        helperText={form.touched.hairNatural && form.errors.hairNatural}
                    />
                </Box>
                <Box>
                    <TextField
                        margin='dense'
                        id='distinguishingFeatures'
                        label={t('form.work.character.distinguishingFeatures')}
                        name='distinguishingFeatures'
                        fullWidth
                        multiline
                        variant='standard'
                        value={form.values.distinguishingFeatures}
                        onChange={form.handleChange}
                        error={
                            form.touched.distinguishingFeatures &&
                            Boolean(form.errors.distinguishingFeatures)
                        }
                        helperText={
                            form.touched.distinguishingFeatures &&
                            form.errors.distinguishingFeatures
                        }
                    />
                </Box>
            </Box>
            <Box className='grid grid-cols-2 gap-5'>
                <Box>
                    <TextField
                        margin='dense'
                        id='personalityPositive'
                        label={t('form.work.character.personalityPositive')}
                        name='personalityPositive'
                        fullWidth
                        multiline
                        variant='standard'
                        value={form.values.personalityPositive}
                        onChange={form.handleChange}
                        error={
                            form.touched.personalityPositive &&
                            Boolean(form.errors.personalityPositive)
                        }
                        helperText={
                            form.touched.personalityPositive && form.errors.personalityPositive
                        }
                    />
                </Box>
                <Box>
                    <TextField
                        margin='dense'
                        id='personalityNegative'
                        label={t('form.work.character.personalityNegative')}
                        name='personalityNegative'
                        fullWidth
                        multiline
                        variant='standard'
                        value={form.values.personalityNegative}
                        onChange={form.handleChange}
                        error={
                            form.touched.personalityNegative &&
                            Boolean(form.errors.personalityNegative)
                        }
                        helperText={
                            form.touched.personalityNegative && form.errors.personalityNegative
                        }
                    />
                </Box>
            </Box>
            <Box className='grid grid-cols-2 gap-5'>
                <Box>
                    <TextField
                        margin='dense'
                        id='ambitions'
                        label={t('form.work.character.ambitions')}
                        name='ambitions'
                        fullWidth
                        multiline
                        variant='standard'
                        value={form.values.ambitions}
                        onChange={form.handleChange}
                        error={form.touched.ambitions && Boolean(form.errors.ambitions)}
                        helperText={form.touched.ambitions && form.errors.ambitions}
                    />
                </Box>
                <Box>
                    <TextField
                        margin='dense'
                        id='fears'
                        label={t('form.work.character.fears')}
                        name='fears'
                        fullWidth
                        multiline
                        variant='standard'
                        value={form.values.fears}
                        onChange={form.handleChange}
                        error={form.touched.fears && Boolean(form.errors.fears)}
                        helperText={form.touched.fears && form.errors.fears}
                    />
                </Box>
            </Box>
            <TextareaField
                form={form}
                fieldName='history'
                label={t('form.work.character.history')}
            />
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t(
                        character?.id
                            ? 'form.work.character.button.update'
                            : 'form.work.character.button.create'
                    )}
                </Button>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={() => setOpen(false)} severity='success'>
                    {t('form.work.character.alert.success')}
                </Alert>
            </Snackbar>
        </Stack>
    )
}

export default CharacterForm
