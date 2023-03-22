import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import { TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { SectionMode } from '@sl/constants/sectionMode'
import TextField from '@sl/components/TextField'
import TextareaField from '@sl/components/TextareaField'
import SectionModel from '@sl/db/models/SectionModel'
import { SectionDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'

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

const SceneForm = ({ scene }: { scene: SectionModel }) => {
    const [reRender, setReRender] = useState<boolean>(false)

    const { t } = useTranslation()
    const messenger = useMessenger()

    useEffect(() => {
        setReRender(true)
        setTimeout(() => setReRender(false), 1)
    }, [scene.id])

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        enableReinitialize: true,
        initialValues: {
            title: scene.title || '',
            description: scene.description || '',
            wordGoal: scene.wordGoal,
            deadlineAt: scene.deadlineAt,
            order: scene.order
        },
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

    if (reRender) return null

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField autoFocus form={form} name='title' label={t('form.work.section.title')} />
            <TextareaField
                form={form}
                label={t('form.work.section.description')}
                fieldName='description'
            />
            <Box className='grid grid-cols-2 gap-4'>
                <TextField
                    type='number'
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                    fullWidth={false}
                    form={form}
                    name='wordGoal'
                    label={t('form.work.section.wordGoal')}
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
