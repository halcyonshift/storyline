import { MenuItem, TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import FormWrapper from '@sl/components/FormWrapper'
import ImageField from '@sl/components/form/ImageField'
import TextareaField from '@sl/components/form/TextareaField'
import TextField from '@sl/components/form/TextField'
import { Status } from '@sl/constants/status'
import { WorkModel } from '@sl/db/models'
import { WorkDataType } from '@sl/db/models/types'
import useMessenger from '@sl/layouts/useMessenger'
import { WorkFormProps } from './types'

const WorkForm = ({ work, initialValues }: WorkFormProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const database = useDatabase()
    const messenger = useMessenger()

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
            if (initialValues.title) {
                await work.updateWork(values)
                messenger.success(t('form.work.work.alert.success'))
            } else {
                work = await database.write(async () => {
                    return await database.get<WorkModel>('work').create((work) => {
                        work.title = values.title
                        work.author = values.author
                        work.language = values.language
                        work.status = Status.TODO
                    })
                })

                const part = await work.addPart()
                const chapter = await part.addChapter()
                await chapter.addScene()
                form.resetForm()
                navigate(`/work/${work.id}`)
            }
        }
    })

    return (
        <FormWrapper
            form={form}
            title={work?.title || t('view.storyline.work.add')}
            model={work}
            tabList={[t('component.formWrapper.tab.general')]}>
            <>
                <TextField
                    autoFocus
                    form={form}
                    label={t('form.work.work.title.label')}
                    name='title'
                />
                <TextField label={t('form.work.work.author')} name='author' form={form} />
                <TextField select form={form} name='language' label={t('form.work.work.language')}>
                    <MenuItem value='en-gb'>English (UK)</MenuItem>
                    <MenuItem value='en-us'>English (US)</MenuItem>
                    <MenuItem value='en-au'>English (Australian)</MenuItem>
                </TextField>
                {initialValues.title ? (
                    <>
                        <TextareaField
                            form={form}
                            fieldName='summary'
                            label={t('form.work.work.summary')}
                        />
                        <TextField
                            form={form}
                            label={t('form.work.work.wordGoal')}
                            name='wordGoal'
                            type='number'
                            InputProps={{ inputProps: { min: 0, step: 1 } }}
                        />
                        <ImageField form={form} label={t('form.work.work.image')} dir='works' />
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
                            renderInput={(params) => <MuiTextField margin='dense' {...params} />}
                        />
                    </>
                ) : null}
            </>
        </FormWrapper>
    )
}

export default WorkForm
