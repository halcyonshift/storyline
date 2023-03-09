import { useContext } from 'react'

import { SettingsContext } from './context'

const useSettings = () => useContext(SettingsContext)

export default useSettings
