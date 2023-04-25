import { useEffect, useState, SyntheticEvent } from 'react'
import CategoryIcon from '@mui/icons-material/Category'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { Autocomplete, Box, Button, IconButton, TextField as MuiTextField } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { AutocompleteOption } from '@sl/types'
import { TimelineFormProps, TimeLineValuesType } from './types'
import { CharacterModel, ItemModel, LocationModel, NoteModel } from '@sl/db/models'

const TimelineFilterForm = ({ work, setAnchorEl, setTable, table, setId }: TimelineFormProps) => {
    const { t } = useTranslation()
    const [options, setOptions] = useState<AutocompleteOption[]>([])
    const [autoId, setAutoId] = useState<AutocompleteOption>({ id: '', label: '' })
    const [characters, setCharacters] = useState<CharacterModel[]>([])
    const [items, setItems] = useState<ItemModel[]>([])
    const [locations, setLocations] = useState<LocationModel[]>([])
    const [notes, setNotes] = useState<NoteModel[]>([])

    const validationSchema = yup.object({
        character: yup.string().nullable(),
        note: yup.string().nullable(),
        scene: yup.string().nullable()
    })

    const form: FormikProps<TimeLineValuesType> = useFormik<TimeLineValuesType>({
        enableReinitialize: true,
        validationSchema,
        initialValues: {
            character: '',
            note: '',
            scene: ''
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSubmit: async (values: TimeLineValuesType) => {
            setAnchorEl(null)
        }
    })

    useEffect(() => {
        work.characters.then((characters) => setCharacters(characters))
        work.items.then((items) => setItems(items))
        work.locations.then((locations) => setLocations(locations))
        work.notes.then((notes) => setNotes(notes))
    }, [])

    useEffect(() => {
        const data = {
            character: characters,
            item: items,
            location: locations,
            note: notes
        }

        setOptions(
            data[table as keyof typeof data].map((item) => ({
                id: item.id,
                label: item.displayName
            }))
        )
    }, [table, characters, items, locations, notes])

    return (
        <Box component='form' onSubmit={form.handleSubmit} className='grid grid-cols-1 gap-3 w-64'>
            <Box>
                <Box className='flex justify-around'>
                    <IconButton onClick={() => setTable('character')}>
                        <PersonIcon className='text-emerald-600' />
                    </IconButton>
                    <IconButton onClick={() => setTable('location')}>
                        <LocationOnIcon className='text-amber-600' />
                    </IconButton>
                    <IconButton onClick={() => setTable('item')}>
                        <CategoryIcon className='text-purple-600' />
                    </IconButton>
                    <IconButton onClick={() => setTable('note')}>
                        <StickyNote2Icon className='text-sky-600' />
                    </IconButton>
                </Box>
                <Autocomplete
                    fullWidth
                    getOptionLabel={(option: AutocompleteOption) => option?.label || ''}
                    options={options}
                    value={autoId?.id}
                    freeSolo
                    forcePopupIcon={true}
                    onChange={(event: SyntheticEvent, value: AutocompleteOption) => {
                        setAutoId(value?.id ? value : { id: '', label: '' })
                        setId(value?.id)
                    }}
                    renderInput={(params) => (
                        <MuiTextField
                            {...params}
                            label={t('form.work.overview.timeline.filter.table')}
                        />
                    )}
                />
            </Box>
            <Button type='submit' variant='contained'>
                {t('form.work.overview.timeline.filter.button')}
            </Button>
        </Box>
    )
}

export default TimelineFilterForm
