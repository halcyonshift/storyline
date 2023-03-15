import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { TextField as MuiTextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { DateTime } from 'luxon'
import { FieldType, DateFieldProps } from './types'
import { useTranslation } from 'react-i18next'
import TextField from '../TextField'
const DateField = ({
    form,
    fieldType,
    fieldName = 'date',
    label = 'component.dateField.label'
}: DateFieldProps) => {
    const [mode, setMode] = useState<FieldType>(fieldType || 'picker')
    const { t } = useTranslation()

    return (
        <Box className='flex'>
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
                        renderInput={(params) => (
                            <MuiTextField fullWidth margin='dense' {...params} />
                        )}
                    />
                ) : (
                    <TextField form={form} label={t(label)} name={fieldName} autoFocus />
                )}
            </Box>
            <Box className='pl-1 flex flex-col justify-center'>
                <Button
                    className='whitespace-nowrap'
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
            </Box>
        </Box>
    )
}

export default DateField
