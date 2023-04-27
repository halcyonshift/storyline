import { ReactElement, useState } from 'react'
import { Category, Person, LocationOn, StickyNote2 } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { getHex } from '@sl/theme/utils'
import { SelectorProps } from './types'
import { ColorType } from '@sl/theme/types'
import { useTranslation } from 'react-i18next'

const Selector = ({ onClick }: SelectorProps) => {
    const [active, setActive] = useState<string>('character')
    const { t } = useTranslation()

    const handleClick = (table: string) => {
        setActive(table)
        onClick(table)
    }

    const buttons: { table: string; color: ColorType; icon: ReactElement }[] = [
        { table: 'character', color: 'emerald', icon: <Person /> },
        { table: 'location', color: 'amber', icon: <LocationOn /> },
        { table: 'item', color: 'purple', icon: <Category /> },
        { table: 'note', color: 'sky', icon: <StickyNote2 /> }
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
