import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormikProps, useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import SectionModel from '@sl/db/models/SectionModel'
import { SectionDataType } from '@sl/db/models/types'

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

// eslint-disable-next-line complexity
const SceneForm = ({ scene }: { scene: SectionModel }) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState<boolean>(false)
    const [reRender, setReRender] = useState<boolean>(false)

    useEffect(() => {
        setReRender(true)
        setTimeout(() => setReRender(false), 1)
    }, [scene.id])

    const form: FormikProps<SectionDataType> = useFormik<SectionDataType>({
        enableReinitialize: true,
        initialValues: {
            title: scene.title,
            description: scene.description || '',
            wordGoal: scene.wordGoal,
            deadlineAt: scene.deadlineAt,
            order: scene.order
        },
        validationSchema,
        onSubmit: async (values: SectionDataType) => {
            await scene.updateSection(values)
            setOpen(true)
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
                    InputProps={{ inputProps: { min: 0, step: 100 } }}
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
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={() => setOpen(false)} severity='success'>
                    {t('form.work.section.alert.success', { name: 'part' })}
                </Alert>
            </Snackbar>
        </Stack>
    )
}

export default SceneForm
