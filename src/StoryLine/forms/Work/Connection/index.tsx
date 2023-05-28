import { useEffect, useState, SyntheticEvent, ReactNode } from 'react'
import { Autocomplete, Box, Button, TextField as MuiTextField } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import ColorField from '@sl/components/form/ColorField'
import DateField from '@sl/components/form/DateField'
import RadioField from '@sl/components/form/RadioField'
import Selector from '@sl/components/Selector'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { CharacterModel, ItemModel, LocationModel, NoteModel } from '@sl/db/models'
import { ConnectionDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { AutocompleteOption } from '@sl/types'
import { ConnectionFormProps } from './types'
import TooltipIconButton from '@sl/components/TooltipIconButton'

const ConnectionForm = ({ work, connection, initialValues, setOpen }: ConnectionFormProps) => {
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
        color: yup.string().nullable(),
        tableA: yup.string().oneOf(['character', 'item', 'location', 'note']),
        tableB: yup.string().oneOf(['character', 'item', 'location', 'note']),
        idA: yup.string().required(t('form.required')),
        idB: yup.string().required(t('form.required')),
        mode: yup.string().required(t('form.required')),
        relation: yup.string().nullable(),
        to: yup.boolean(),
        from: yup.boolean()
    })

    const form: FormikProps<ConnectionDataType> = useFormik<ConnectionDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: ConnectionDataType) => {
            if (connection?.id) {
                connection.updateRecord(values)
                messenger.success(t('form.work.connection.alert.success'))
            } else {
                await work.addConnection(values)
                form.resetForm()
            }
            setOpen(false)
        }
    })

    useEffect(() => {
        work.characters.then((characters) => setCharacters(characters))
        work.items.then((items) => setItems(items))
        work.locations.then((locations) => setLocations(locations))
        work.notes.then((notes) => setNotes(notes))
    }, [])

    useEffect(() => {
        if (!connection?.id) return

        Promise.all([connection.fromRecord(), connection.toRecord()]).then(
            ([fromRecord, toRecord]) => {
                form.setFieldValue('mode', connection.mode)
                form.setFieldValue('relation', connection.relation)
                form.setFieldValue('from', connection.from)
                form.setFieldValue('date', connection.date)
                form.setFieldValue('color', connection.color)
                form.setFieldValue('to', connection.to)
                form.setFieldValue('tableA', connection.tableA)
                form.setFieldValue('tableB', connection.tableB)
                form.setFieldValue('idA', connection.idA)
                form.setFieldValue('idB', connection.idB)
                setIdA({ id: connection.idA, label: fromRecord.displayName })
                setIdB({ id: connection.idB, label: toRecord.displayName })
            }
        )
    }, [connection?.id])

    useEffect(() => {
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
    }, [form.values.tableB, initialValues.tableB, characters, items, locations])

    useEffect(() => {
        if (idA.id && optionsA.length && !optionsA.find((option) => option.id === idA.id)) {
            setIdA({ id: '', label: '' })
        }
    }, [optionsA, idA])

    useEffect(() => {
        if (idB.id && optionsB.length && !optionsB.find((option) => option.id === idB.id)) {
            setIdB({ id: '', label: '' })
        }
    }, [optionsB, idB])

    useEffect(() => {
        if (!form.values.from && !form.values.to) {
            form.setFieldValue('to', true)
        }
    }, [form.values.from, form.values.to])

    return (
        <Box component='form' className='grid grid-cols-1 gap-3' onSubmit={form.handleSubmit}>
            <Box className='grid grid-cols-12 gap-3'>
                <Box className='col-span-5'>
                    <Selector onClick={(table) => form.setFieldValue('tableA', table)} />
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
                            <MuiTextField
                                {...params}
                                label={t('form.work.connection.table')}
                                error={form.touched.idA && Boolean(form.errors.idA)}
                                helperText={form.touched.idA && (form.errors.idA as ReactNode)}
                            />
                        )}
                    />
                </Box>
                <Box className='col-span-2 text-center flex flex-col justify-center'>
                    <Box>
                        <TooltipIconButton
                            text={t('form.work.connection.to')}
                            icon={GLOBAL_ICONS.next}
                            color={form.values.to ? 'success' : 'inherit'}
                            onClick={() => form.setFieldValue('to', !form.values.to)}
                        />
                        <TooltipIconButton
                            text={t('form.work.connection.from')}
                            icon={GLOBAL_ICONS.back}
                            color={form.values.from ? 'success' : 'inherit'}
                            onClick={() => form.setFieldValue('from', !form.values.from)}
                        />
                    </Box>
                </Box>
                <Box className='col-span-5'>
                    <Selector onClick={(table) => form.setFieldValue('tableB', table)} />
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
                            <MuiTextField
                                {...params}
                                error={form.touched.idB && Boolean(form.errors.idB)}
                                helperText={form.touched.idB && (form.errors.idB as ReactNode)}
                                label={t('form.work.connection.table')}
                            />
                        )}
                    />
                </Box>
            </Box>
            <TextField
                label={t('form.work.connection.mode.label')}
                placeholder={t('form.work.connection.mode.placeholder')}
                name='mode'
                form={form}
            />
            <RadioField
                form={form}
                name='relation'
                label='form.work.connection.relation.label'
                options={[
                    {
                        value: '',
                        label: 'form.work.connection.relation.option0'
                    },
                    {
                        value: 'parent',
                        label: 'form.work.connection.relation.option1'
                    },
                    {
                        value: 'child',
                        label: 'form.work.connection.relation.option2'
                    },
                    {
                        value: 'sibling',
                        label: 'form.work.connection.relation.option3'
                    }
                ]}
            />
            <Box className='grid grid-cols-2 gap-2'>
                <DateField form={form} label={'form.work.connection.date'} fieldName='date' />
                <ColorField name='color' form={form} />
            </Box>
            <Box>
                <TextareaField fieldName='body' form={form} />
            </Box>
            <Box className='flex justify-between'>
                {connection?.id ? (
                    <Button
                        onClick={async () => {
                            await connection.delete()
                            setOpen(false)
                        }}>
                        {t('form.work.connection.button.delete')}
                    </Button>
                ) : null}
                <Button type='submit' variant='contained'>
                    {t('form.work.connection.button.save')}
                </Button>
            </Box>
        </Box>
    )
}

export default ConnectionForm
