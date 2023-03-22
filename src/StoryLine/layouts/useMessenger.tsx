import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { MessengerContextType, StatusType } from './types'

const MessengerContext = createContext({} as MessengerContextType)

export const MessengerProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState<boolean>()
    const [message, setMessage] = useState<string | null>()
    const [status, setStatus] = useState<StatusType>('info')

    useEffect(() => setOpen(Boolean(message)), [message])
    useEffect(() => {
        if (!open) {
            setTimeout(() => setMessage(null), 500)
        }
    }, [open])

    const error = (message: string) => {
        setMessage(message)
        setStatus('error')
    }

    const warning = (message: string) => {
        setMessage(message)
        setStatus('warning')
    }

    const info = (message: string) => {
        setMessage(message)
        setStatus('info')
    }

    const success = (message: string) => {
        setMessage(message)
        setStatus('success')
    }

    return (
        <MessengerContext.Provider
            value={{
                error,
                warning,
                info,
                success,
                open,
                setOpen,
                status,
                message
            }}>
            {children}
        </MessengerContext.Provider>
    )
}

const useMessenger = () => useContext(MessengerContext)

export default useMessenger
