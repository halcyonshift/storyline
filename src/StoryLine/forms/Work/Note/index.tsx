import { Box, Button, Stack } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import FormButton from '@sl/components/FormButton'
import ColorField from '@sl/components/form/ColorField'
import DateField from '@sl/components/form/DateField'
import ImageField from '@sl/components/form/ImageField'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { NoteDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { NoteFormProps } from './types'

const NoteForm = ({
    work,
    note,
    belongsTo,
    initialValues = {
        title: '',
        body: '',
        url: '',
        image: '',
        date: '',
        color: '',
        order: null
    }
}: NoteFormProps) => {
    const messenger = useMessenger()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        title: yup.string().required(t('form.note.title.required')),
        body: yup.string().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable(),
        date: yup.string().nullable(),
        color: yup.string().nullable(),
        order: yup.number().min(0).nullable()
    })

    const form: FormikProps<NoteDataType> = useFormik<NoteDataType>({
        initialValues,
        validationSchema,
        onSubmit: async (values: NoteDataType) => {
            if (initialValues.title) {
                note.updateNote(values)
                messenger.success(t('form.work.note.alert.success'))
            } else {
                const newNote = note ? await note.addNote(values) : await work.addNote(values)
                if (belongsTo) await newNote.updateAssociation(belongsTo)
                form.resetForm()
                navigate(`/works/${work.id}/note/${newNote.id}`)
            }
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <Box className='grid grid-cols-2 gap-4'>
                <Box>
                    <ImageField label='' form={form} dir='notes' />
                </Box>
                <Box>
                    <TextField label={t('form.work.note.title.label')} name='title' form={form} />
                    <TextField
                        label={t('form.work.note.url')}
                        name='url'
                        form={form}
                        type='url'
                        placeholder='https://'
                    />
                    <DateField form={form} label={'form.work.note.date'} fieldName='date' />
                    <TextField
                        fullWidth={false}
                        form={form}
                        label={t('form.work.note.order')}
                        name='order'
                        type='number'
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                    />
                    <ColorField name='color' form={form} />
                </Box>
            </Box>
            <TextareaField fieldName='body' form={form} />
            <FormButton
                label={t(
                    initialValues.title
                        ? 'form.work.note.button.update'
                        : 'form.work.note.button.create'
                )}
            />
        </Stack>
    )
}

export default NoteForm
