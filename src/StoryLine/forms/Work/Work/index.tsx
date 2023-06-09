import { Box, TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import FormWrapper from '@sl/components/FormWrapper'
import ImageField from '@sl/components/form/ImageField'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { WorkDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { WorkFormProps } from './types'

const WorkForm = ({ work, initialValues }: WorkFormProps) => {
    const { t } = useTranslation()
    const messenger = useMessenger()
    const navigate = useNavigate()

    const validationSchema = yup.object({
        title: yup.string().required(t('form.work.work.title.required')),
        author: yup.string().nullable(),
        language: yup.string(),
        image: yup.string().nullable(),
        summary: yup.string().nullable(),
        wordGoal: yup.number().nullable(),
        deadlineAt: yup.date().nullable()
    })

    const form: FormikProps<WorkDataType> = useFormik<WorkDataType>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values: WorkDataType) => {
            values.wordGoal = values.wordGoal ? Number(values.wordGoal) : null
            await work.updateRecord(values)
            navigate(`/work/${work.id}`)
            messenger.success(t('form.work.work.alert.success'))
        }
    })

    return (
        <FormWrapper
            form={form}
            title={work?.title || t('view.storyline.work.add')}
            model={work}
            tabList={[t('component.formWrapper.tab.general')]}>
            <>
                <Box className='grid grid-cols-2 gap-3'>
                    <Box>
                        <Box className='grid grid-cols-1 gap-3'>
                            <TextField
                                autoFocus
                                form={form}
                                label={t('form.work.work.title.label')}
                                name='title'
                            />
                            <TextField
                                label={t('form.work.work.author')}
                                name='author'
                                form={form}
                            />
                            <TextField
                                form={form}
                                label={t('form.work.work.wordGoal')}
                                name='wordGoal'
                                type='number'
                                InputProps={{ inputProps: { min: 0, step: 1 } }}
                            />
                            <DatePicker
                                label={t('form.work.work.deadline')}
                                inputFormat='d/M/yyyy'
                                disableMaskedInput
                                value={form.values.deadlineAt}
                                onChange={(newValue: DateTime | null) => {
                                    form.setFieldValue(
                                        'deadlineAt',
                                        newValue ? newValue.toJSDate() : null
                                    )
                                }}
                                renderInput={(params) => (
                                    <MuiTextField margin='dense' {...params} />
                                )}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <ImageField form={form} dir='works' label={t('form.work.work.image')} />
                    </Box>
                </Box>
                <TextareaField
                    form={form}
                    fieldName='summary'
                    label={t('form.work.work.summary')}
                />
            </>
        </FormWrapper>
    )
}

export default WorkForm
