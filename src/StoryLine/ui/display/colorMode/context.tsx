/** @format */

import { createContext, ReactNode, useState } from 'react'

type modeType = 'dark' | 'light'

export const ColorModeContext = createContext(
    {} as {
        mode: modeType
        setMode: (mode: modeType) => void
    }
)

const ColorModeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<modeType>('light')

    return (
        <ColorModeContext.Provider
            value={{
                mode,
                setMode
            }}>
            {children}
        </ColorModeContext.Provider>
    )
}

export default ColorModeProvider
