import { ReactElement } from 'react'
import { TooltipIconButtonProps } from '@sl/components/TooltipIconButton/types'

export type PanelProps = {
    navigation: TooltipIconButtonProps[]
    children?: ReactElement | ReactElement[]
    action?: ReactElement
}

export type UseResize = {
    width: number
    enableResize: () => void
}
