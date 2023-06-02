import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import { TwitterPicker } from 'react-color'
import { useTranslation } from 'react-i18next'
import TooltipIconButton from '@sl/components/TooltipIconButton'
import { GLOBAL_ICONS } from '@sl/constants/icons'
import { ColorType } from '@sl/theme/types'
import { getHex } from '@sl/theme/utils'
import { ColorFieldProps } from './types'

const ColorField = ({ form, name = 'color', label }: ColorFieldProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const { t } = useTranslation()
    const colors = [
        'black',
        'white',
        'slate',
        'gray',
        'zinc',
        'neutral',
        'stone',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose'
    ].map((color: ColorType) => getHex(color, 400))

    return (
        <Box className='flex'>
            <Stack className='relative flex-grow flex' spacing={1}>
                <InputLabel>{t(label)}</InputLabel>
                <Stack spacing={1} direction='row'>
                    <Button
                        aria-describedby={anchorEl ? `colorfield-${name}` : undefined}
                        className='colorField border w-10 h-10 shadow rounded'
                        sx={{ backgroundColor: form.values[name] || getHex('white') }}
                        onClick={(e) => setAnchorEl(e.currentTarget)}></Button>
                    <TooltipIconButton
                        text='component.colorField.clear'
                        icon={GLOBAL_ICONS.delete}
                        onClick={() => {
                            form.setFieldValue(name, '')
                        }}
                    />
                </Stack>
                {open ? (
                    <Popover
                        id={`colorfield-${name}`}
                        elevation={0}
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}>
                        <Box className='px-1 py-3'>
                            <TwitterPicker
                                color={form.values[name] || getHex('white')}
                                colors={colors}
                                onChangeComplete={(color) => form.setFieldValue(name, color.hex)}
                            />
                        </Box>
                    </Popover>
                ) : null}
            </Stack>
        </Box>
    )
}

export default ColorField
