import { ReactElement, useState } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { CHARACTER_ICONS, ITEM_ICONS, LOCATION_ICONS, NOTE_ICONS } from '@sl/constants/icons'
import { ColorType } from '@sl/theme/types'
import { getHex } from '@sl/theme/utils'
import { SelectorProps } from './types'

const Selector = ({ onClick }: SelectorProps) => {
    const [active, setActive] = useState<string>('character')
    const { t } = useTranslation()

    const handleClick = (table: string) => {
        setActive(table)
        onClick(table)
    }

    const buttons: { table: string; color: ColorType; icon: ReactElement }[] = [
        { table: 'character', color: 'emerald', icon: CHARACTER_ICONS.character },
        { table: 'location', color: 'amber', icon: LOCATION_ICONS.location },
        { table: 'item', color: 'purple', icon: ITEM_ICONS.item },
        { table: 'note', color: 'sky', icon: NOTE_ICONS.note }
    ]

    return (
        <Box className='flex justify-around'>
            {buttons.map((button) => (
                <Box className={button.table === active ? 'opacity-100' : 'opacity-50'}>
                    <Tooltip title={t(`component.separator.${button.table}`)}>
                        <IconButton
                            key={button.table}
                            onClick={() => handleClick(button.table)}
                            sx={{ color: getHex(button.color, 600) }}>
                            {button.icon}
                        </IconButton>
                    </Tooltip>
                </Box>
            ))}
        </Box>
    )
}

export default Selector
