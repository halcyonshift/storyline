export type StatusType = 'error' | 'warning' | 'info' | 'success'

export type MessengerContextType = {
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
    success: (message: string) => void
    open: boolean
    setOpen: (state: boolean) => void
    status: StatusType
    message: string
}

export type TourContextType = {
    start: (mode: 'storyline' | 'work') => void
}
