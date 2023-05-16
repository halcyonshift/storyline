import { ReactElement } from 'react'

export type AccordionProps = {
    id: string
    title: ReactElement
    children: ReactElement
    className?: string
    sx?: object
}
