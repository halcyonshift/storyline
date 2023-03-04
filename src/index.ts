import { app, BrowserWindow, ipcMain, dialog, session } from 'electron'
import contextMenu from 'electron-context-menu'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
    app.quit()
}

contextMenu({
    showSaveImageAs: true
})

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            spellcheck: false
        }
    })

    mainWindow
        .loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
        .then(() => {
            if (!app.isPackaged) {
                mainWindow.webContents.openDevTools()
            }
        })
        .catch(() => null)
}

app.on('ready', () => {
    createWindow()

    if (app.isPackaged) {
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Content-Security-Policy': [
                        'img-src data: https://*.grammarly.com',
                        // eslint-disable-next-line max-len
                        'connect-src https://*.grammarly.com https://*.grammarly.io wss://*.grammarly.com',
                        "style-src 'self' 'unsafe-inline'",
                        "script-src 'self' 'unsafe-eval' https://*.grammarly.com"
                    ]
                }
            })
        })
    }

    /*
    const template: MenuItem[] = [
        {
            label: 'StoryLine',
            submenu: [
                {
                    label: 'About StoryLine',
                    selector: 'orderFrontStandardAboutPanel:'
                },
                {
                    type: 'separator'
                },
            ]
        },
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    */
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady()
    .then(() => {
        ipcMain.handle('dialog', (_, method: string, params: Electron.OpenDialogOptions) => {
            if (method === 'showOpenDialog') dialog.showOpenDialog(params)
        })
    })
    .catch(() => null)
