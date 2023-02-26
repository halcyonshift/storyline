import { app, BrowserWindow, ipcMain, dialog } from 'electron'


declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
    app.quit()
}

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        },
    })

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
    createWindow()
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

app.whenReady().then(() => {
    ipcMain.handle('dialog', (_, method, params) => {
        if (method === 'showOpenDialog') dialog.showOpenDialog(params)
    })
})