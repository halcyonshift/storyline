import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { GLOBAL_ICONS } from '../../icons'

import { DateTime } from 'luxon'

import { FieldType, DateProps } from './types'
import { useTranslation } from 'react-i18next'

const DateField = ({ form, fieldType }: DateProps) => {
    const [mode, setMode] = useState<FieldType>(fieldType || 'picker')
    const { t } = useTranslation()

    return (
        <Stack direction='row'>
            <Box>
                {mode === 'picker' ? (
                    <DatePicker
                        label={t('component.dateField.label')}
                        inputFormat='d/M/yyyy'
                        disableMaskedInput
                        value={form.values.date || null}
                        onChange={(value: DateTime | null) => {
                            form.setFieldValue('date', value ? value.toFormat('yyyy-MM-dd') : null)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                ) : (
                    <TextField
                        label={t('component.dateField.label')}
                        autoFocus
                        value={form.values.date ? form.values.date.toString() : ''}
                        onChange={(e) => form.setFieldValue('date', e.target.value)}
                        error={form.touched.date && Boolean(form.errors.date)}
                        helperText={form.touched.date && form.errors.date}
                    />
                )}
            </Box>
            <Button
                variant='text'
                size='small'
                startIcon={GLOBAL_ICONS.change}
                onClick={() => setMode(mode === 'picker' ? 'custom' : 'picker')}>
                {t(
                    mode === 'picker'
                        ? 'component.dateField.toggle.custom'
                        : 'component.dateField.toggle.picker'
                )}
            </Button>
        </Stack>
    )
}

export default DateField
