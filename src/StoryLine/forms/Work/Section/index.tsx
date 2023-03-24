import { useEffect, useState, SyntheticEvent } from 'react'
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField as MuiTextField
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { SectionMode } from '@sl/constants/sectionMode'
import { PointOfView } from '@sl/constants/pov'
import DateField from '@sl/components/form/DateField'
import TextField from '@sl/components/form/TextField'
import TextareaField from '@sl/components/form/TextareaField'
import { SectionDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { AutocompleteOption } from '@sl/types'
import { SectionFormProps } from './types'
import { useRouteLoaderData } from 'react-router-dom'
import { CharacterModel, WorkModel } from '@sl/db/models'

const validationSchema = yup.object({
    title: yup.string(),
    description: yup.string().nullable(),
    date: yup.string().nullable(),
    wordGoal: yup.number().positive().integer().nullable(),
    deadlineAt: yup.date().nullable(),
    order: yup.number().positive().min(0),
    pointOfView: yup.string().nullable(),
    pointOfViewCharacter: yup.string().nullable()
})

const SectionForm = ({ section, initialValues }: SectionFormProps) => {
    const work = useRouteLoaderData('work') as WorkModel
    const [povCharacter, setPovCharacter] = useState<AutocompleteOption>({ id: '', label: '' })
    const [characters, setCharacters] = useState<CharacterModel[]>([])
    const [options, setOptions] = useState<AutocompleteOption[]>([])
    const messenger = useMessenger()
    const { t } = useTranslation()

    useEffect(() => {
        work.character
            .extend(Q.sortBy('display_name', Q.asc))
            .fetch()
            .then((characters) => {
                setCharacters(characters)
                setOptions(
                    characters.map((character) => ({
                        id: character.id,
                        label: character.displayName
                    }))
                )
            })
    }, [])

    useEffect(() => {
        if (section.pointOfViewCharacter?.id && options.length) {
            setPovCharacter(options.find((option) => option.id === section.pointOfViewCharacter.id))
        } else {
            setPovCharacter({ id: '', label: '' })
        }
    }, [options, section.id])

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: SectionDataType) => {
            await section.updateSection(values)
            await section.updatePoVCharacter(
                characters.find((character) => character.id === povCharacter?.id)
            )
            messenger.success(
                t('form.work.section.alert.success', {
                    name: SectionMode[section.mode].toLowerCase()
                })
            )
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField autoFocus form={form} name='title' label={t('form.work.section.title')} />
            <TextareaField form={form} label='' fieldName='description' />
            {section.isScene ? (
                <Box className='grid grid-cols-2 gap-4'>
                    <FormControl fullWidth>
                        <InputLabel id='pov-label'>{t('form.work.section.pointOfView')}</InputLabel>
                        <Select
                            labelId='pov-label'
                            id='pov-select'
                            name='pointOfView'
                            value={form.values.pointOfView || ''}
                            label={t('form.work.section.pointOfView')}
                            error={form.touched.pointOfView && Boolean(form.errors.pointOfView)}
                            onChange={form.handleChange}>
                            <MenuItem value=''>{t('form.work.global.none')}</MenuItem>
                            {Object.keys(PointOfView).map((pov) => (
                                <MenuItem key={pov} value={pov}>
                                    {t(`constant.pointOfView.${pov}`)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Autocomplete
                        getOptionLabel={(option: AutocompleteOption) => option?.label || ''}
                        options={options}
                        forcePopupIcon={true}
                        freeSolo
                        value={povCharacter}
                        onChange={(_: SyntheticEvent, value: AutocompleteOption) => {
                            setPovCharacter({
                                id: value?.id || '',
                                label: value?.label || ''
                            })
                        }}
                        renderInput={(params) => (
                            <MuiTextField
                                {...params}
                                label={t('form.work.section.pointOfViewCharacter')}
                            />
                        )}
                    />
                </Box>
            ) : null}
            <Box className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
                <DateField form={form} label={'form.work.section.date'} fieldName='date' />
                <TextField
                    form={form}
                    label={t('form.work.section.order')}
                    name='order'
                    type='number'
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
                <TextField
                    form={form}
                    label={t('form.work.section.wordGoal')}
                    name='wordGoal'
                    type='number'
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
                <DatePicker
                    label={t('form.work.section.deadline')}
                    inputFormat='d/M/yyyy'
                    disableMaskedInput
                    value={form.values.deadlineAt}
                    onChange={(newValue: DateTime | null) => {
                        form.setFieldValue('deadlineAt', newValue ? newValue.toJSDate() : null)
                    }}
                    renderInput={(params) => <MuiTextField margin='dense' {...params} />}
                />
            </Box>
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t('form.work.section.button.update')}
                </Button>
            </Box>
        </Stack>
    )
}

export default SectionForm
