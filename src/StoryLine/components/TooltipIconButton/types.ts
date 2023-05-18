import { MouseEvent, ReactElement } from 'react'
import { IconButtonProps } from '@mui/material'

export type TooltipIconButtonProps = {
    text: string
    icon: ReactElement
    link?: string
    confirm?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void
} & IconButtonProps
