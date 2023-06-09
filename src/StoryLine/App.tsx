import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Alert, Box, Snackbar } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import * as Sentry from '@sentry/react'
import { Settings } from 'luxon'
import { useTranslation } from 'react-i18next'
import { Outlet, useRouteLoaderData } from 'react-router-dom'
import TermsAndConditions from './components/TermsAndConditions'
import { WorkModel } from '@sl/db/models'
import useMessenger from '@sl/layouts/useMessenger'
import { TourProvider } from '@sl/layouts/useTour'
import useSettings from '@sl/theme/useSettings'
import { ErrorBoundary } from '@sl/views/StoryLine'

const App = () => {
    const { autoBackupFreq, autoBackupPath } = useSettings()
    const work = useRouteLoaderData('work') as WorkModel

    const settings = useSettings()
    const messenger = useMessenger()
    const { t } = useTranslation()

    useEffect(() => {
        api.shouldUseDarkColors().then((result) => {
            settings.setDisplayMode(result ? 'dark' : 'light')
        })
    }, [])

    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!work || !autoBackupPath) return
            messenger.warning(t('autoBackup.warning'))
            const { data, images, backupPath } = await work.backup()
            const filePath = await api.backupWork(data, images, backupPath)
            if (filePath) {
                messenger.success(t('autoBackup.success', { filePath }))
            } else {
                messenger.error(t('autoBackup.failure', { filePath: autoBackupPath }))
            }
        }, autoBackupFreq * 60 * 1000 || 315360000000)
        return () => {
            clearInterval(intervalId)
        }
    }, [autoBackupFreq, autoBackupPath, work?.id])

    Settings.defaultZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return (
        <Sentry.ErrorBoundary fallback={ErrorBoundary} showDialog>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={settings.theme}>
                    <CssBaseline />
                    <Box id='app' className={`${settings.displayMode} flex h-full`}>
                        <TourProvider>
                            <Outlet />
                        </TourProvider>
                        <Snackbar
                            open={messenger.open}
                            autoHideDuration={6000}
                            onClose={() => messenger.setOpen(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                            <Alert
                                onClose={() => messenger.setOpen(false)}
                                severity={messenger.status}>
                                {messenger.message}
                            </Alert>
                        </Snackbar>
                    </Box>
                    <TermsAndConditions />
                </ThemeProvider>
            </LocalizationProvider>
        </Sentry.ErrorBoundary>
    )
}

export default App
