import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Snackbar from '@mui/material/Snackbar'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Settings } from 'luxon'
import { Outlet } from 'react-router-dom'
import useMessenger from '@sl/layouts/useMessenger'
import useSettings from '@sl/theme/useSettings'

const App = () => {
    const settings = useSettings()
    const messenger = useMessenger()

    Settings.defaultZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={settings.theme}>
                <CssBaseline />
                <Box id='app' className={`${settings.displayMode} flex h-full`}>
                    <Outlet />
                    <Snackbar
                        open={messenger.open}
                        autoHideDuration={6000}
                        onClose={() => messenger.setOpen(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                        <Alert onClose={() => messenger.setOpen(false)} severity={messenger.status}>
                            {messenger.message}
                        </Alert>
                    </Snackbar>
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

export default App
