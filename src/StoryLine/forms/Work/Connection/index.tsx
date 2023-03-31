import { useEffect, useState, SyntheticEvent } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowFowardIcon from '@mui/icons-material/ArrowForward'
import CategoryIcon from '@mui/icons-material/Category'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { Autocomplete, Box, Button, IconButton, TextField as MuiTextField } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import ColorField from '@sl/components/form/ColorField'
import DateField from '@sl/components/form/DateField'
import TextareaField from '@sl/components/form/TextareaField'
import { CharacterModel, ItemModel, LocationModel, NoteModel } from '@sl/db/models'
import TextField from '@sl/components/form/TextField'
import { ConnectionDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { AutocompleteOption } from '@sl/types'
import { ConnectionFormProps } from './types'

const ConnectionForm = ({ work, connection, initialValues }: ConnectionFormProps) => {
    const { t } = useTranslation()
    const messenger = useMessenger()
    const [characters, setCharacters] = useState<CharacterModel[]>([])
    const [items, setItems] = useState<ItemModel[]>([])
    const [locations, setLocations] = useState<LocationModel[]>([])
    const [notes, setNotes] = useState<NoteModel[]>([])
    const [optionsA, setOptionsA] = useState<AutocompleteOption[]>([])
    const [optionsB, setOptionsB] = useState<AutocompleteOption[]>([])
    const [idA, setIdA] = useState<AutocompleteOption>({ id: '', label: '' })
    const [idB, setIdB] = useState<AutocompleteOption>({ id: '', label: '' })

    const validationSchema = yup.object({
        body: yup.string().nullable(),
        date: yup.string().nullable(),
        color: yup.string().nullable()
    })

    const form: FormikProps<ConnectionDataType> = useFormik<ConnectionDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: ConnectionDataType) => {
            if (connection?.id) {
                connection.updateConnection(values)
                messenger.success(t('form.work.connection.alert.success'))
            } else {
                await work.addConnection(values)
                form.resetForm()
            }
        }
    })

    useEffect(() => {
        work.characters.then((characters) => setCharacters(characters))
        work.items.then((items) => setItems(items))
        work.locations.then((locations) => setLocations(locations))
        work.notes.then((notes) => setNotes(notes))
    }, [])

    useEffect(() => {
        setIdA({ id: '', label: '' })
        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        setOptionsA(
            data[form.values.tableA as keyof typeof data].map((item) => ({
                id: item.id,
                label: item.displayName
            }))
        )
    }, [form.values.tableA, characters, items, locations])

    useEffect(() => {
        setIdB({ id: '', label: '' })
        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        setOptionsB(
            data[form.values.tableB as keyof typeof data].map((item) => ({
                id: item.id,
                label: item.displayName
            }))
        )
    }, [form.values.tableB, characters, items, locations])

    useEffect(() => {
        if (!form.values.from && !form.values.to) {
            form.setFieldValue('to', true)
        }
    }, [form.values.from, form.values.to])

    return (
        <Box component='form' onSubmit={form.handleSubmit}>
            <Box className='grid grid-cols-12 gap-2'>
                <Box className='col-span-5'>
                    <Box className='flex justify-around'>
                        <IconButton onClick={() => form.setFieldValue('tableA', 'character')}>
                            <PersonIcon className='text-emerald-600' />
                        </IconButton>
                        <IconButton onClick={() => form.setFieldValue('tableA', 'location')}>
                            <LocationOnIcon className='text-amber-600' />
                        </IconButton>
                        <IconButton onClick={() => form.setFieldValue('tableA', 'item')}>
                            <CategoryIcon className='text-purple-600' />
                        </IconButton>
                        <IconButton onClick={() => form.setFieldValue('tableA', 'note')}>
                            <StickyNote2Icon className='text-sky-600' />
                        </IconButton>
                    </Box>
                    <Autocomplete
                        fullWidth
                        getOptionLabel={(option: AutocompleteOption) => option?.label || ''}
                        options={optionsA}
                        value={idA}
                        freeSolo
                        forcePopupIcon={true}
                        onChange={(event: SyntheticEvent, value: AutocompleteOption) => {
                            setIdA(value?.id ? value : { id: '', label: '' })
                            form.setFieldValue('idA', value?.id || '')
                        }}
                        renderInput={(params) => (
                            <MuiTextField {...params} label={t('form.connection.table')} />
                        )}
                    />
                </Box>
                <Box className='col-span-2 text-center'>
                    <IconButton onClick={() => form.setFieldValue('to', !form.values.to)}>
                        <ArrowFowardIcon color={form.values.to ? 'success' : 'inherit'} />
                    </IconButton>
                    <IconButton onClick={() => form.setFieldValue('from', !form.values.from)}>
                        <ArrowBackIcon color={form.values.from ? 'success' : 'inherit'} />
                    </IconButton>
                </Box>
                <Box className='col-span-5'>
                    <Box className='flex justify-around'>
                        <IconButton onClick={() => form.setFieldValue('tableB', 'character')}>
                            <PersonIcon className='text-emerald-600' />
                        </IconButton>
                        <IconButton onClick={() => form.setFieldValue('tableB', 'location')}>
                            <LocationOnIcon className='text-amber-600' />
                        </IconButton>
                        <IconButton onClick={() => form.setFieldValue('tableB', 'item')}>
                            <CategoryIcon className='text-purple-600' />
                        </IconButton>
                        <IconButton onClick={() => form.setFieldValue('tableB', 'note')}>
                            <StickyNote2Icon className='text-sky-600' />
                        </IconButton>
                    </Box>
                    <Autocomplete
                        fullWidth
                        getOptionLabel={(option: AutocompleteOption) => option?.label || ''}
                        options={optionsB}
                        value={idB}
                        freeSolo
                        forcePopupIcon={true}
                        onChange={(event: SyntheticEvent, value: AutocompleteOption) => {
                            setIdB(value?.id ? value : { id: '', label: '' })
                            form.setFieldValue('idB', value?.id || '')
                        }}
                        renderInput={(params) => (
                            <MuiTextField {...params} label={t('form.connection.table')} />
                        )}
                    />
                </Box>
            </Box>
            <TextField name='mode' form={form} />
            <Box className='grid grid-cols-2 gap-2'>
                <DateField form={form} label={'form.work.connection.date'} fieldName='date' />
                <ColorField name='color' form={form} />
            </Box>
            <TextareaField fieldName='body' form={form} />
            <Button type='submit'>Save</Button>
        </Box>
    )
}

export default ConnectionForm
