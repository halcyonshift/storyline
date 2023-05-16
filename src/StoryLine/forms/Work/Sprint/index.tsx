import { Box, Button } from '@mui/material'
import * as chrono from 'chrono-node'
import { useFormik } from 'formik'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import TextField from '@sl/components/form/TextField'
import { SprintFormProps } from './types'

const SprintForm = ({ work, setDialogOpen }: SprintFormProps) => {
    const { t } = useTranslation()

    const validationSchema = yup.object({
        wordGoal: yup.number().positive().nullable()
    })

    const form = useFormik({
        enableReinitialize: true,
        initialValues: {
            duration: '2 hr',
            wordGoal: 500
        },
        validationSchema,
        onSubmit: async (values) => {
            await work.addSprint({
                wordGoal: Number(values.wordGoal) || null,
                startAt: new Date(),
                endAt:
                    chrono.parseDate(values.duration, new Date(), {
                        forwardDate: true
                    }) || DateTime.now().plus({ hours: 2 }).toJSDate()
            })
            setDialogOpen(false)
        }
    })

    return (
        <Box component='form' className='grid grid-cols-1 gap-5' onSubmit={form.handleSubmit}>
            <Box className='grid grid-cols-2 gap-5'>
                <TextField label={t('form.work.sprint.duration')} name='duration' form={form} />
                <TextField label={t('form.work.sprint.wordGoal')} name='wordGoal' form={form} />
            </Box>
            <Box textAlign='center'>
                <Button variant='contained' type='submit'>
                    {t('form.work.sprint.button.start')}
                </Button>
            </Box>
        </Box>
    )
}

export default SprintForm
