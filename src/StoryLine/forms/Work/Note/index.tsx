import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import FormWrapper from '@sl/components/FormWrapper'
import ColorField from '@sl/components/form/ColorField'
import DateField from '@sl/components/form/DateField'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { NoteDataType } from '@sl/db/models/types'
import ImageField from '@sl/components/form/ImageField'
import useMessenger from '@sl/layouts/useMessenger'

import { NoteFormProps } from './types'

const NoteForm = ({ work, note, belongsTo, initialValues }: NoteFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const messenger = useMessenger()

    const validationSchema = yup.object({
        title: yup.string().required(t('form.work.note.title.required')),
        body: yup.string().nullable(),
        url: yup.string().url().nullable(),
        image: yup.string().nullable(),
        date: yup.string().nullable(),
        color: yup.string().nullable(),
        isTaggable: yup.boolean()
    })

    const form: FormikProps<NoteDataType> = useFormik<NoteDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: NoteDataType) => {
            if (initialValues.title) {
                note.updateRecord(values)
                messenger.success(t('form.work.note.alert.success'))
            } else {
                const newNote = note ? await note.addNote(values) : await work.addNote(values)
                if (belongsTo) {
                    await newNote.updateAssociation(belongsTo)
                }
                form.resetForm()
                if (belongsTo) {
                    navigate(`/work/${work.id}/${belongsTo.table}/${belongsTo.id}/edit`)
                } else {
                    navigate(`/work/${work.id}/note/${newNote.id}/edit`)
                }
            }
        }
    })

    const getTitle = (): string => {
        if (belongsTo?.displayName && !initialValues.title) {
            return `${belongsTo.displayName}: ${t('layout.work.panel.note.addNote')}`
        }

        return note?.displayName || t('layout.work.panel.note.addNote')
    }

    return (
        <FormWrapper
            form={form}
            title={getTitle()}
            model={note}
            tabList={[t('component.formWrapper.tab.general')]}>
            <>
                <Box className='grid grid-cols-2 gap-3 '>
                    <Box>
                        <Box className='grid grid-cols-1 gap-3'>
                            <TextField
                                label={t('form.work.note.title.label')}
                                name='title'
                                form={form}
                            />
                            <TextField
                                label={t('form.work.note.url')}
                                name='url'
                                form={form}
                                type='url'
                                placeholder='https://'
                            />
                            <Box className='xl:w-1/2'>
                                <DateField
                                    form={form}
                                    label={'form.work.note.date'}
                                    fieldName='date'
                                />
                            </Box>
                            <ColorField name='color' form={form} />
                            <FormGroup>
                                <FormControlLabel
                                    id='isTaggable'
                                    control={
                                        <Checkbox
                                            name='isTaggable'
                                            checked={form.values.isTaggable}
                                            onChange={form.handleChange}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    }
                                    label={t('form.work.note.isTaggable')}
                                />
                            </FormGroup>
                        </Box>
                    </Box>
                    <Box>
                        <ImageField form={form} dir='notes' />
                    </Box>
                </Box>
                <TextareaField fieldName='body' form={form} />
            </>
        </FormWrapper>
    )
}

export default NoteForm
