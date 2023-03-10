import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { FormikProps, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { WorkModel } from '@sl/db/models'
import { WorkDataType } from '@sl/db/models/types'

const AddWorkForm = () => {
    const database = useDatabase()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const validationSchema = yup.object({
        title: yup.string().required('Please give a project title'),
        author: yup.string(),
        language: yup.string()
    })

    const form: FormikProps<WorkDataType> = useFormik<WorkDataType>({
        initialValues: {
            title: '',
            author: '',
            language: 'en-gb'
        },
        validationSchema: validationSchema,
        onSubmit: async (values: WorkDataType) => {
            const work = await database.write(async () => {
                return await database.get<WorkModel>('work').create((work) => {
                    work.title = values.title
                    work.author = values.author
                    work.language = values.language
                })
            })

            const part = await work.addPart()
            const chapter = await part.addChapter()
            await chapter.addScene()

            form.resetForm()
            navigate(`/works/${work.id}`)
        }
    })

    return (
        <Stack component={'form'} spacing={2} onSubmit={form.handleSubmit} autoComplete='off'>
            <TextField
                autoFocus
                margin='dense'
                id='title'
                label='Title'
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
                id='author'
                label='Author'
                name='author'
                fullWidth
                variant='standard'
                value={form.values.author}
                onChange={form.handleChange}
                error={form.touched.author && Boolean(form.errors.author)}
                helperText={form.touched.author && form.errors.author}
            />
            <TextField
                select
                margin='dense'
                fullWidth
                variant='standard'
                id='language'
                name='language'
                label='Language'
                value={form.values.language}
                onChange={form.handleChange}>
                <MenuItem value='en-gb'>English (UK)</MenuItem>
                <MenuItem value='en-us'>English (US)</MenuItem>
                <MenuItem value='en-au'>English (Australian)</MenuItem>
            </TextField>
            <Button type='submit' variant='contained'>
                Create
            </Button>
        </Stack>
    )
}

export default AddWorkForm
