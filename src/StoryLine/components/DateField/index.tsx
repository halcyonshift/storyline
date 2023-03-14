import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { DateTime } from 'luxon'
import { FieldType, DateFieldProps } from './types'
import { useTranslation } from 'react-i18next'

const DateField = ({
    form,
    fieldType,
    fieldName = 'date',
    label = 'component.dateField.label'
}: DateFieldProps) => {
    const [mode, setMode] = useState<FieldType>(fieldType || 'picker')
    const { t } = useTranslation()

    return (
        <Stack direction='row'>
            <Box>
                {mode === 'picker' ? (
                    <DatePicker
                        label={t(label)}
                        inputFormat='d/M/yyyy'
                        disableMaskedInput
                        value={form.values[fieldName] || null}
                        onChange={(value: DateTime | null) => {
                            form.setFieldValue(
                                fieldName,
                                value ? value.toFormat('yyyy-MM-dd') : null
                            )
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                ) : (
                    <TextField
                        label={t(label)}
                        autoFocus
                        value={form.values[fieldName] ? form.values[fieldName].toString() : ''}
                        onChange={(e) => form.setFieldValue(fieldName, e.target.value)}
                        error={form.touched[fieldName] && Boolean(form.errors[fieldName])}
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
