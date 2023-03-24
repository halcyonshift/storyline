import { IconButtonProps } from '@mui/material'
import { ReactElement } from 'react'

export type TooltipIconButtonProps = {
    text: string
    icon: ReactElement
    link?: string
    confirm?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: () => Promise<void> | void
} & IconButtonProps
