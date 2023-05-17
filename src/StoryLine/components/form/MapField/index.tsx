import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { LatLngExpression } from 'leaflet'
import { useTranslation } from 'react-i18next'
import { useMapEvent } from 'react-leaflet'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import useOnlineStatus from '@sl/utils/useOnlineStatus'
import Map from '../../Map'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { FieldType, MapFieldProps, LocationMarkerProps } from './types'

const LocationMarker = ({ form }: LocationMarkerProps) => {
    useMapEvent('click', (e) => {
        form.setFieldValue('latitude', e.latlng.lat)
        form.setFieldValue('longitude', e.latlng.lng)
    })

    return <></>
}

const MapField = ({ form, fieldType }: MapFieldProps) => {
    const [mode, setMode] = useState<FieldType>(fieldType || 'picker')
    const [inputType, setInputType] = useState<string>('hidden')
    const [center] = useState<LatLngExpression | null>(() =>
        form.values.latitude && form.values.longitude
            ? [parseFloat(form.values.latitude), parseFloat(form.values.longitude)]
            : null
    )
    const { t } = useTranslation()
    const isOnline = useOnlineStatus()

    useEffect(() => {
        const isPicker = isOnline && mode === 'picker'
        setInputType(isPicker ? 'hidden' : 'number')
    }, [isOnline, mode])

    return (
        <Box className='flex'>
            <Box className='flex-grow'>
                {mode === 'picker' ? (
                    <Stack spacing={2}>
                        <Map center={center}>
                            <LocationMarker form={form} />
                        </Map>
                        <Typography variant='body2' textAlign='center'>
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
            <Box className='pl-1 flex flex-col justify-center'>
                <TooltipIconButton
                    disabled={!isOnline}
                    text={t(
                        mode === 'picker'
                            ? 'component.mapField.toggle.custom'
                            : 'component.mapField.toggle.picker'
                    )}
                    icon={GLOBAL_ICONS.change}
                    onClick={() => setMode(mode === 'picker' ? 'custom' : 'picker')}
                />
            </Box>
        </Box>
    )
}

export default MapField
