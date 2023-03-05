import { IconButtonProps } from '@mui/material'
import { ReactElement } from 'react'

export type TooltipIconButtonProps = {
    text: string
    icon: ReactElement
    link: string
} & IconButtonProps
