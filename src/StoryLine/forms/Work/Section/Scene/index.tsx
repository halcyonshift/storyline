import { useEffect, useState } from 'react'
import { Box, Button, Stack, TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { SectionMode } from '@sl/constants/sectionMode'
import DateField from '@sl/components/form/DateField'
import TextField from '@sl/components/form/TextField'
import TextareaField from '@sl/components/form/TextareaField'
import { SectionDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { SceneFormProps } from './types'

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

const SceneForm = ({ scene, initialValues }: SceneFormProps) => {
    const messenger = useMessenger()
    const { t } = useTranslation()

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: SectionDataType) => {
            await scene.updateSection(values)
            messenger.success(
                t('form.work.section.alert.success', {
                    name: SectionMode.SCENE.toLowerCase()
                })
            )
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField autoFocus form={form} name='title' label={t('form.work.section.title')} />
            <TextareaField form={form} label='' fieldName='description' />
            <Box className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
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

export default SceneForm
