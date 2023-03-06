import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useMapEvent, Marker, Popup } from 'react-leaflet'

import { GLOBAL_ICONS } from '@sl/constants/icons'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import Map from '../Map'
import { FieldType, MapFieldProps, LocationMarkerProps } from './types'

const LocationMarker = ({ form }: LocationMarkerProps) => {
    useMapEvent('click', (e) => {
        form.setFieldValue('latitude', e.latlng.lat)
        form.setFieldValue('longitude', e.latlng.lng)
    })

    return <></>
}

const MapField = ({ form, fieldType, label }: MapFieldProps) => {
    const [mode, setMode] = useState<FieldType>(fieldType || 'picker')
    const [inputType, setInputType] = useState<string>('hidden')
    const { t } = useTranslation()
    const isOnline = useOnlineStatus()

    useEffect(() => {
        const isPicker = isOnline && mode === 'picker'
        setInputType(isPicker ? 'hidden' : 'number')
    }, [isOnline, mode])

    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Stack direction='row'>
                <Box>
                    {mode === 'picker' ? (
                        <Stack spacing={2}>
                            <Map>
                                <LocationMarker form={form} />
                            </Map>
                            <Typography>
                                {form.values.latitude} {form.values.longitude}
                            </Typography>
                        </Stack>
                    ) : null}
                    <Stack direction='row' spacing={2}>
                        <TextField
                            label={t('component.mapField.latitude')}
                            type={inputType}
                            variant='standard'
                            value={form.values.latitude ? form.values.latitude.toString() : ''}
                            onChange={(e) => form.setFieldValue('latitude', e.target.value)}
                            error={form.touched.latitude && Boolean(form.errors.latitude)}
                            helperText={form.touched.latitude && form.errors.latitude}
                        />
                        <TextField
                            label={t('component.mapField.longitude')}
                            type={inputType}
                            variant='standard'
                            value={form.values.longitude ? form.values.longitude.toString() : ''}
                            onChange={(e) => form.setFieldValue('longitude', e.target.value)}
                            error={form.touched.longitude && Boolean(form.errors.longitude)}
                            helperText={form.touched.longitude && form.errors.longitude}
                        />
                    </Stack>
                </Box>
                <Button
                    disabled={!isOnline}
                    variant='text'
                    size='small'
                    startIcon={GLOBAL_ICONS.change}
                    onClick={() => setMode(mode === 'picker' ? 'custom' : 'picker')}>
                    {t(
                        mode === 'picker'
                            ? 'component.mapField.toggle.custom'
                            : 'component.mapField.toggle.picker'
                    )}
                </Button>
            </Stack>
        </>
    )
}

export default MapField
