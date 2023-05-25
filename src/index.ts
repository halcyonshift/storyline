import {
    app,
    BrowserWindow,
    ipcMain,
    session,
    shell,
    Menu,
    MenuItemConstructorOptions
} from 'electron'
import contextMenu from 'electron-context-menu'
import { init } from '@sentry/electron/main'
import path from 'path'
import * as apiBackup from './StoryLine/api/backup'
import * as apiRestore from './StoryLine/api/restore'
import * as apiExport from './StoryLine/api/export'
import * as apiImport from './StoryLine/api/import'
import deleteFile from './StoryLine/api/deleteFile'
import selectFile from './StoryLine/api/selectFile'
import selectFilePath from './StoryLine/api/selectFilePath'
import selectImage from './StoryLine/api/selectImage'
import showImage from './StoryLine/api/showImage'
import i18n from './StoryLine/i18n'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (app.isPackaged) {
    init({
        dsn: process.env.SENTRY_DSN
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
        frame: false,
        icon: './src/StoryLine/assets/images/icons/linux.png'
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
        },
        icon: './src/StoryLine/assets/images/icons/linux.png'
    })

    mainWindow.webContents.on('will-navigate', function (e, url) {
        if (!url.includes('localhost')) {
            e.preventDefault()
            shell.openExternal(url)
        }
    })

    mainWindow.once('ready-to-show', () => {
        splashWindow.close()
        mainWindow.show()
        if (!app.isPackaged) {
            mainWindow.webContents.openDevTools()
        }
        mainWindow.webContents.openDevTools()
    })

    mainWindow.on('enter-full-screen', () => {
        mainWindow.webContents.send('full-screen', true)
    })

    mainWindow.on('leave-full-screen', () => {
        mainWindow.webContents.send('full-screen', false)
    })

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).catch(() => null)

    mainWindow.webContents.setWindowOpenHandler(() => {
        return { action: 'deny' }
    })
}

app.on('ready', () => {
    const template = [
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
            ] as MenuItemConstructorOptions[]
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
            ] as MenuItemConstructorOptions[]
        }
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    createWindow()

    const csp = [
        'img-src data: https://*.grammarly.com https://*.tile.osm.org',
        "connect-src 'self' https://*.grammarly.com https://*.grammarly.io wss://*.grammarly.com",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-eval' https://*.grammarly.com",
        "object-src 'none'"
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
        ipcMain.handle('relaunch', () => {
            app.relaunch()
            app.exit()
        })
        ipcMain.handle('delete-file', deleteFile)
        ipcMain.handle('backup-storyline', apiBackup.storyLine)
        ipcMain.handle('backup-work', apiBackup.work)
        ipcMain.handle(
            'restore-storyline',
            async () => await apiRestore.storyLine(path.join(app.getPath('userData')))
        )
        ipcMain.handle(
            'restore-work',
            async () => await apiRestore.work(path.join(app.getPath('userData')))
        )
        ipcMain.handle('export-docx', apiExport.docx)
        ipcMain.handle('export-epub', apiExport.epub)
        ipcMain.handle('export-html', apiExport.html)
        ipcMain.handle('export-markdown', apiExport.markdown)
        ipcMain.handle('export-rtf', apiExport.rtf)
        ipcMain.handle('export-text', apiExport.text)
        ipcMain.handle(
            'import-ao3',
            async (_, id: number, mode: 'series' | 'work') =>
                await apiImport.ao3(app.getPath('userData'), id, mode)
        )
        ipcMain.handle(
            'import-bibisco2',
            async () => await apiImport.bibisco(app.getPath('userData'))
        )
        ipcMain.handle('import-epub', async () => await apiImport.epub(app.getPath('userData')))
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
