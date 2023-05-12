import { app, BrowserWindow, ipcMain, session, shell, Menu } from 'electron'
import contextMenu from 'electron-context-menu'
import { init } from '@sentry/electron/main'
import path from 'path'
import backup from './StoryLine/api/backup'
import * as apiExport from './StoryLine/api/export'
import * as apiImport from './StoryLine/api/import'
import deleteFile from './StoryLine/api/deleteFile'
import restore from './StoryLine/api/restore'
import selectFile from './StoryLine/api/selectFile'
import selectFilePath from './StoryLine/api/selectFilePath'
import selectImage from './StoryLine/api/selectImage'
import showImage from './StoryLine/api/showImage'
import i18n from './StoryLine/i18n'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (app.isPackaged) {
    init({
        dsn: 'https://41e621e8f6ea49b5b01855d8d13dd496@o215263.ingest.sentry.io/4505164795936768'
    })
}

if (require('electron-squirrel-startup')) {
    app.quit()
}

contextMenu({
    showSaveImageAs: true
})

const createWindow = (): void => {
    const splashWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        frame: false
    })

    splashWindow.loadFile('./src/splash.html')
    splashWindow.center()

    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 1024,
        minHeight: 768,
        show: false,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            spellcheck: true
        }
    })

    mainWindow.webContents.on('will-navigate', function (e, url) {
        if (!url.includes('localhost')) {
            e.preventDefault()
            shell.openExternal(url)
        }
    })

    mainWindow.on('will-resize', (_, newBounds) => {
        mainWindow.webContents.send('window-will-resize', newBounds)
    })

    mainWindow.once('ready-to-show', () => {
        splashWindow.close()
        mainWindow.show()
        if (!app.isPackaged) {
            mainWindow.webContents.openDevTools()
        }
    })

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).catch(() => null)

    mainWindow.webContents.setWindowOpenHandler(() => {
        return { action: 'deny' }
    })
}

app.on('ready', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template: any = [
        {
            label: i18n.t('menu.storyline'),
            submenu: [
                {
                    label: `${i18n.t('menu.version')}: ${app.getVersion()}`,
                    enabled: false
                },
                {
                    label: i18n.t('menu.quit'),
                    accelerator: 'CmdOrCtrl+Q',
                    click: app.quit
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    createWindow()

    const csp = [
        'img-src data: https://*.grammarly.com http://*.tile.osm.org',
        "connect-src 'self' https://*.grammarly.com https://*.grammarly.io wss://*.grammarly.com",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-eval' https://*.grammarly.com"
    ]

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': csp
            }
        })
    })
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
        ipcMain.handle('backup', backup)
        ipcMain.handle('delete-file', deleteFile)
        ipcMain.handle('export-html', apiExport.html)
        ipcMain.handle('export-docx', apiExport.docx)
        ipcMain.handle(
            'import-bibisco2',
            async () => await apiImport.bibisco(app.getPath('userData'))
        )
        ipcMain.handle('restore', async () => await restore(path.join(app.getPath('userData'))))
        ipcMain.handle('select-file-path', selectFilePath)
        ipcMain.handle(
            'select-image',
            async (_, subDir) =>
                await selectImage(path.join(app.getPath('userData'), 'images', subDir))
        )
        ipcMain.handle(
            'select-file',
            async (_, subDir) =>
                await selectFile(path.join(app.getPath('userData'), 'import', subDir))
        )
        ipcMain.handle('show-image', showImage)
    })
    .catch(() => null)
