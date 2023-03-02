/** @format */

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { FormikProps, useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { SectionModel, WorkModel } from '../../../db/models'
import { WorkDataType } from '../../../db/models/types'

const Form = () => {
    const database = useDatabase()
    const navigate = useNavigate()

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
            const newWork = await database.write(async () => {
                const work = await database.get<WorkModel>('work').create((work) => {
                    work.title = values.title
                    work.author = values.author
                    work.language = values.language
                })

                const part = await database.get<SectionModel>('section').create((section) => {
                    section.work.set(work)
                    section.mode = 'part'
                    section.order = 1
                })

                const chapter = await database.get<SectionModel>('section').create((chapter) => {
                    chapter.work.set(work)
                    chapter.section.set(part)
                    chapter.mode = 'chapter'
                    chapter.order = 1
                })

                const scene = await database.get<SectionModel>('section').create((scene) => {
                    scene.work.set(work)
                    scene.section.set(chapter)
                    scene.mode = 'scene'
                    scene.order = 1
                })

                return { work, part, chapter, scene }
            })

            form.resetForm()
            navigate(`/works/${newWork.scene.id}`)
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

export default Form
