import { useEffect, useState } from 'react'
import { Box, Button, Stack, TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import TextField from '@sl/components/form/TextField'
import { SectionMode } from '@sl/constants/sectionMode'
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

const PartForm = ({ part, initialValues }: PartFormProps) => {
    const messenger = useMessenger()
    const { t } = useTranslation()
    const [reRender, setReRender] = useState<boolean>(false)

    useEffect(() => {
        setReRender(true)
        setTimeout(() => setReRender(false), 1)
    }, [part.id])

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        enableReinitialize: true,
        initialValues,
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
            <TextField autoFocus label={t('form.work.section.title')} name='title' form={form} />
            <TextField label={t('form.work.section.description')} name='description' form={form} />
            <Stack direction='row' spacing={2}>
                <TextField
                    label={t('form.work.section.order')}
                    form={form}
                    name='order'
                    type='number'
                    InputProps={{ inputProps: { min: 0 } }}
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
