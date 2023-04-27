import { useEffect, useState, SyntheticEvent } from 'react'
import { Autocomplete, Box, TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { SectionMode } from '@sl/constants/sectionMode'
import { PointOfView } from '@sl/constants/pov'
import DateField from '@sl/components/form/DateField'
import SelectField from '@sl/components/form/SelectField'
import TextField from '@sl/components/form/TextField'
import TextareaField from '@sl/components/form/TextareaField'
import FormWrapper from '@sl/components/FormWrapper'
import { SectionDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { AutocompleteOption } from '@sl/types'
import { autoCompleteOptions } from '@sl/utils'
import { SectionFormProps } from './types'

const SectionForm = ({ work, section, initialValues }: SectionFormProps) => {
    const [povCharacter, setPovCharacter] = useState<AutocompleteOption>({ id: '', label: '' })
    const [tagCharacters, setTagCharacters] = useState<AutocompleteOption[]>([])
    const [tagItems, setTagItems] = useState<AutocompleteOption[]>([])
    const [tagLocations, setTagLocations] = useState<AutocompleteOption[]>([])
    const [tagNotes, setTagNotes] = useState<AutocompleteOption[]>([])
    const [characterOptions, setCharacterOptions] = useState<AutocompleteOption[]>([])
    const [itemOptions, setItemOptions] = useState<AutocompleteOption[]>([])
    const [locationOptions, setLocationOptions] = useState<AutocompleteOption[]>([])
    const [noteOptions, setNoteOptions] = useState<AutocompleteOption[]>([])
    const { t } = useTranslation()
    const messenger = useMessenger()

    useEffect(() => {
        Promise.all([
            work.characters.fetch(),
            work.items.fetch(),
            work.locations.fetch(),
            work.taggableNotes.fetch(),
            section.tag.fetch()
        ]).then(([characters, items, locations, notes, tags]) => {
            setCharacterOptions(autoCompleteOptions(characters))
            setItemOptions(autoCompleteOptions(items))
            setLocationOptions(autoCompleteOptions(locations))
            setNoteOptions(autoCompleteOptions(notes))
            setTagCharacters(
                tags
                    .filter((tag) => tag.character.id)
                    .map((tag) => ({
                        id: tag.character.id,
                        label: characters.find((character) => character.id === tag.character.id)
                            .displayName
                    }))
            )
            setTagItems(
                tags
                    .filter((tag) => tag.item.id)
                    .map((tag) => ({
                        id: tag.item.id,
                        label: items.find((item) => item.id === tag.item.id).displayName
                    }))
            )
            setTagLocations(
                tags
                    .filter((tag) => tag.location.id)
                    .map((tag) => ({
                        id: tag.location.id,
                        label: locations.find((location) => location.id === tag.location.id)
                            .displayName
                    }))
            )
            setTagNotes(
                tags
                    .filter((tag) => tag.note.id)
                    .map((tag) => ({
                        id: tag.note.id,
                        label: notes.find((note) => note.id === tag.note.id)?.displayName
                    }))
            )
        })
    }, [section.id])

    useEffect(() => {
        if (section.pointOfViewCharacter?.id && characterOptions.length) {
            setPovCharacter(
                characterOptions.find((option) => option.id === section.pointOfViewCharacter.id)
            )
        } else {
            setPovCharacter({ id: '', label: '' })
        }
    }, [characterOptions, section.id])

    const validationSchema = yup.object({
        title: yup.string().nullable(),
        description: yup.string().nullable(),
        date: yup.string().nullable(),
        wordGoal: yup.number().integer().nullable(),
        deadlineAt: yup.date().nullable(),
        pointOfView: yup.string().nullable(),
        pointOfViewCharacter: yup.string().nullable()
    })

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: SectionDataType) => {
            const characters = await work.characters.fetch()
            const items = await work.items.fetch()
            const locations = await work.locations.fetch()
            const notes = await work.notes.fetch()
            await section.updateSection(values, {
                characters: tagCharacters.map((tag) =>
                    characters.find((character) => character.id === tag.id)
                ),
                items: tagItems.map((tag) => items.find((item) => item.id === tag.id)),
                locations: tagLocations.map((tag) =>
                    locations.find((location) => location.id === tag.id)
                ),
                notes: tagNotes.map((tag) => notes.find((note) => note.id === tag.id))
            })
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
        <FormWrapper
            form={form}
            title={section.displayName}
            model={section}
            tabList={[t('component.formWrapper.tab.general')]}>
            <Box className='grid grid-cols-1 gap-3 mt-3'>
                <TextField
                    autoFocus
                    form={form}
                    name='title'
                    label={t('form.work.section.title')}
                />
                <TextareaField form={form} fieldName='description' />
                {section.isScene ? (
                    <Box className='grid grid-cols-2 gap-3'>
                        <SelectField
                            form={form}
                            name='pointOfView'
                            label={t('form.work.section.pointOfView')}
                            options={[{ value: '', label: t('form.work.global.none') }].concat(
                                Object.keys(PointOfView).map((pov) => ({
                                    value: pov,
                                    label: t(`constant.pointOfView.${pov}`)
                                }))
                            )}
                        />
                        {characterOptions.length ? (
                            <Autocomplete
                                getOptionLabel={(option: AutocompleteOption) => option?.label || ''}
                                options={characterOptions}
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
                        ) : null}
                        {characterOptions.length ? (
                            <Autocomplete
                                multiple
                                isOptionEqualToValue={(option, value) =>
                                    Boolean(option.id === value.id)
                                }
                                options={characterOptions}
                                getOptionLabel={(option) => option.label}
                                value={tagCharacters}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <MuiTextField
                                        {...params}
                                        label={t('form.work.section.tag.characters')}
                                    />
                                )}
                                onChange={(_: SyntheticEvent, value: AutocompleteOption[]) => {
                                    setTagCharacters(value)
                                }}
                            />
                        ) : null}
                        {locationOptions.length ? (
                            <Autocomplete
                                multiple
                                options={locationOptions}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) =>
                                    Boolean(option.id === value.id)
                                }
                                value={tagLocations}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <MuiTextField
                                        {...params}
                                        label={t('form.work.section.tag.locations')}
                                    />
                                )}
                                onChange={(_: SyntheticEvent, value: AutocompleteOption[]) => {
                                    setTagLocations(value)
                                }}
                            />
                        ) : null}
                        {itemOptions.length ? (
                            <Autocomplete
                                multiple
                                options={itemOptions}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) =>
                                    Boolean(option.id === value.id)
                                }
                                value={tagItems}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <MuiTextField
                                        {...params}
                                        label={t('form.work.section.tag.items')}
                                    />
                                )}
                                onChange={(_: SyntheticEvent, value: AutocompleteOption[]) => {
                                    setTagItems(value)
                                }}
                            />
                        ) : null}
                        {noteOptions.length ? (
                            <Autocomplete
                                multiple
                                options={noteOptions}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) =>
                                    Boolean(option.id === value.id)
                                }
                                value={tagNotes}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <MuiTextField
                                        {...params}
                                        label={t('form.work.section.tag.notes')}
                                    />
                                )}
                                onChange={(_: SyntheticEvent, value: AutocompleteOption[]) => {
                                    setTagNotes(value)
                                }}
                            />
                        ) : null}
                    </Box>
                ) : null}
                <Box className='grid grid-cols-2 xl:grid-cols-4 gap-3'>
                    <DateField form={form} label={'form.work.section.date'} fieldName='date' />
                    <TextField
                        fullWidth
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
                        renderInput={(params) => <MuiTextField {...params} />}
                    />
                </Box>
            </Box>
        </FormWrapper>
    )
}

export default SectionForm
