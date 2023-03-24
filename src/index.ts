// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { app, BrowserWindow, ipcMain, dialog, session, shell, Dialog } from 'electron'
import contextMenu from 'electron-context-menu'
import fs from 'fs'
import path from 'path'

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
        minWidth: 1024,
        minHeight: 768,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            spellcheck: true
        }
    })

    mainWindow.on('will-resize', (_, newBounds) => {
        mainWindow.webContents.send('window-will-resize', newBounds)
    })

    mainWindow
        .loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
        .then(() => {
            if (!app.isPackaged) {
                mainWindow.webContents.openDevTools()
            }
        })
        .catch(() => null)
    /*
            // ToDo - make work
    mainWindow.webContents.on('will-navigate', function (e, url) {
        e.preventDefault()
        shell.openExternal(url)
    })
    */
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
        ipcMain.handle('select-image', async (_, subDir) => {
            const result = await dialog.showOpenDialog({
                title: 'Select an image',
                filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
            })

            if (result.canceled || !result.filePaths.length) return false

            const filePath = result.filePaths[0]
            const fileDir = path.join(app.getPath('userData'), 'images', subDir)
            await fs.promises.mkdir(fileDir, { recursive: true })
            const timestamp = new Date().getTime()
            const extension = path.extname(filePath)
            const fileName = `image-${timestamp}${extension}`
            const saveFilePath = path.join(fileDir, fileName)
            await fs.promises.copyFile(filePath, saveFilePath)

            return saveFilePath
        })

        ipcMain.handle('show-image', async (e, filePath) => {
            const extension = path.extname(filePath)
            const img = fs.readFileSync(filePath).toString('base64')
            return `data:image/${extension};base64,${img}`
        })

        ipcMain.handle('delete-file', async (e, path) => {
            fs.rmSync(path)
        })

        ipcMain.handle('dialog', (event, method, params) => {
            switch (method) {
                case 'showOpenDialog':
                    return dialog.showOpenDialog(params)
                    break
            }
        })
    })
    .catch(() => null)
