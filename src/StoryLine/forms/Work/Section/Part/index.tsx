import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { SectionMode } from '@sl/constants/sectionMode'
import SectionModel from '@sl/db/models/SectionModel'
import { SectionDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { PartFormProps } from './types'

const validationSchema = yup.object({
    title: yup.string(),
    description: yup.string().nullable(),
    date: yup.string().nullable(),
    wordGoal: yup.number().positive().integer().nullable(),
    deadlineAt: yup.date().nullable(),
    order: yup.number().positive().min(0)
})

// eslint-disable-next-line complexity
const PartForm = ({ part }: PartFormProps) => {
    const messenger = useMessenger()
    const { t } = useTranslation()
    const [reRender, setReRender] = useState<boolean>(false)

    useEffect(() => {
        setReRender(true)
        setTimeout(() => setReRender(false), 1)
    }, [part.id])

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        enableReinitialize: true,
        initialValues: {
            title: part.title,
            description: part.description || '',
            wordGoal: part.wordGoal,
            deadlineAt: part.deadlineAt,
            order: part.order
        },
        validationSchema,
        onSubmit: async (values: SectionDataType) => {
            await part.updateSection(values)
            messenger.success(
                t('form.work.section.alert.success', { name: SectionMode.PART.toLowerCase() })
            )
        }
    })

    if (reRender) return null

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField
                autoFocus
                margin='dense'
                id='title'
                label={t('form.work.section.title')}
                name='title'
                fullWidth
                variant='standard'
                value={form.values.title}
                onChange={form.handleChange}
                error={form.touched.title && Boolean(form.errors.title)}
                helperText={form.touched.title && form.errors.title}
            />
            <TextField
                margin='dense'
                id='description'
                label={t('form.work.section.description')}
                name='description'
                fullWidth
                multiline
                variant='standard'
                spellCheck={true}
                value={form.values.description}
                onChange={form.handleChange}
                error={form.touched.description && Boolean(form.errors.description)}
                helperText={form.touched.description && form.errors.description}
            />
            <Stack direction='row' spacing={2}>
                <TextField
                    id='order'
                    label={t('form.work.section.order')}
                    name='order'
                    type='number'
                    value={form.values.order}
                    onChange={form.handleChange}
                    error={form.touched.order && Boolean(form.errors.order)}
                    helperText={form.touched.order && form.errors.order}
                    InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                    id='wordGoal'
                    label={t('form.work.section.wordGoal')}
                    name='wordGoal'
                    type='number'
                    value={form.values.wordGoal}
                    onChange={form.handleChange}
                    error={form.touched.wordGoal && Boolean(form.errors.wordGoal)}
                    helperText={form.touched.wordGoal && form.errors.wordGoal}
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
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
            <Box className='text-center border-t pt-3'>
                <Button type='submit' variant='contained'>
                    {t('form.work.section.button.update')}
                </Button>
            </Box>
        </Stack>
    )
}

export default PartForm
