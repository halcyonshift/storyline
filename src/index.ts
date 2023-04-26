// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { app, BrowserWindow, ipcMain, dialog, session, shell, Dialog } from 'electron'
import contextMenu from 'electron-context-menu'
import fs from 'fs'
import { kebabCase } from 'lodash'
import path from 'path'
import HTMLtoDOCX from 'html-to-docx'
import JSZip from 'jszip'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

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
        mainWindow.webContents.openDevTools()
    })

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).catch(() => null)
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
        ipcMain.handle('backup', async (_, json, images, localPath) => {
            const zip = new JSZip()
            zip.file(`${kebabCase(json.work[0].title)}.json`, JSON.stringify(json))
            images.forEach((image: string) => {
                const data = fs.readFileSync(image)
                zip.file(`images/${path.basename(image)}`, data)
            })

            const buffer = await zip.generateAsync({ type: 'nodebuffer' })

            if (localPath) {
                const fileSavePath = `${localPath}${path.sep}${kebabCase(
                    json.work[0].title
                )}-${Date.now().toString()}.zip`
                fs.writeFile(fileSavePath, buffer, () => {
                    // Add sentry error
                })
                return fileSavePath
            } else {
                const result = await dialog.showSaveDialog({
                    defaultPath: `${kebabCase(json.work[0].title)}.zip`,
                    filters: [
                        { name: 'ZIP files', extensions: ['zip'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                })

                if (result.filePath) {
                    // eslint-disable-next-line max-nested-callbacks
                    fs.writeFile(result.filePath, buffer, () => {
                        // ToDo: Add sentry error
                    })

                    return result.filePath
                }
            }

            return false
        })

        ipcMain.handle('export-html', async (_, fileName: string, html: string) => {
            const result = await dialog.showSaveDialog({
                defaultPath: `${kebabCase(fileName)}.html`,
                filters: [{ name: 'All Files', extensions: ['*'] }]
            })

            if (result.filePath) {
                fs.writeFile(result.filePath, html, () => {
                    // ToDo: Add sentry error
                })

                return result.filePath
            }
        })

        ipcMain.handle('export-docx', async (_, fileName: string, html: string) => {
            const result = await dialog.showSaveDialog({
                defaultPath: `${kebabCase(fileName)}.docx`,
                filters: [{ name: 'All Files', extensions: ['*'] }]
            })

            const docx = (await HTMLtoDOCX(
                html,
                '<p></p>',
                { orientation: 'portrait', title: fileName },
                '<p></p>'
            )) as Buffer

            if (result.filePath) {
                fs.writeFile(result.filePath, docx, () => {
                    // ToDo: Add sentry error
                })

                return result.filePath
            }
        })

        ipcMain.handle('select-file-path', async () => {
            const filePath = await dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory']
            })
            return filePath.canceled || !filePath.filePaths.length ? '' : filePath.filePaths[0]
        })

        ipcMain.handle('select-image', async (_, subDir) => {
            const result = await dialog.showOpenDialog({
                title: 'Select an image',
                filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
            })

            if (result.canceled || !result.filePaths.length) return false

            const filePath = result.filePaths[0]
            const fileDir = path.join(app.getPath('userData'), 'images', subDir)
            await fs.promises.mkdir(fileDir, { recursive: true })
            const saveFilePath = path.join(
                fileDir,
                `image-${new Date().getTime()}${path.extname(filePath)}`
            )
            await fs.promises.copyFile(filePath, saveFilePath)

            return saveFilePath
        })

        ipcMain.handle('select-file', async (_, subDir) => {
            const result = await dialog.showOpenDialog({
                title: 'Select a file',
                filters: [{ name: 'Files', extensions: ['bibisco2'] }]
            })

            if (result.canceled || !result.filePaths.length) return false

            const filePath = result.filePaths[0]
            const fileDir = path.join(app.getPath('userData'), 'import', subDir)
            await fs.promises.mkdir(fileDir, { recursive: true })
            const timestamp = new Date().getTime()
            const extension = path.extname(filePath)
            const fileName = `file-${timestamp}${extension}`
            const saveFilePath = path.join(fileDir, fileName)
            await fs.promises.copyFile(filePath, saveFilePath)
            return saveFilePath
        })

        ipcMain.handle('restore', async () => {
            const result = await dialog.showOpenDialog({
                title: 'Select StoryLine archive',
                filters: [{ name: 'Files', extensions: ['zip'] }]
            })
            if (result.canceled || !result.filePaths.length) return false
            const filePath = result.filePaths[0]
            const fileDir = path.join(app.getPath('userData'), 'import')
            await fs.promises.mkdir(fileDir, { recursive: true })
            const saveFilePath = path.join(fileDir, 'restore.zip')
            await fs.promises.copyFile(filePath, saveFilePath)
            const data = await fs.promises.readFile(saveFilePath)
            const zip = await JSZip.loadAsync(data)
            const fileNames = Object.keys(zip.files)

            const jsonFile = zip.file(fileNames.find((file) => file.endsWith('.json')))
            const jsonFileContent = await jsonFile.async('string')

            const imageFiles = fileNames.filter(
                (fileName) => !fileName.endsWith('.json') && fileName.includes('.')
            )
            const json = JSON.parse(jsonFileContent)

            const workId = json.work[0].id

            if (!workId) return false

            const imageFileDir = path.join(app.getPath('userData'), 'images', 'import', workId)
            const images = []

            for (const fileName of imageFiles) {
                const imageName = path.basename(fileName)
                const content = await zip.file(fileName).async('nodebuffer')
                images.push(imageName)
                await fs.promises.mkdir(imageFileDir, { recursive: true })
                await fs.promises.writeFile(path.join(imageFileDir, imageName), content)
            }

            fs.rmSync(saveFilePath)

            return {
                images,
                imagePath: imageFileDir,
                sep: path.sep,
                data: json
            }
        })

        ipcMain.handle('import-bibisco2', async () => {
            const result = await dialog.showOpenDialog({
                title: 'Select .bibisco2 archive',
                filters: [{ name: 'Files', extensions: ['bibisco2'] }]
            })
            if (result.canceled || !result.filePaths.length) return false
            const filePath = result.filePaths[0]
            const fileDir = path.join(app.getPath('userData'), 'import')
            await fs.promises.mkdir(fileDir, { recursive: true })
            const saveFilePath = path.join(fileDir, 'archive.bibisco2')
            await fs.promises.copyFile(filePath, saveFilePath)
            const data = await fs.promises.readFile(saveFilePath)
            const zip = await JSZip.loadAsync(data)
            const fileNames = Object.keys(zip.files)

            const jsonFile = zip.file(fileNames.find((file) => file.endsWith('.json')))
            const jsonFileContent = await jsonFile.async('string')

            const imageFiles = fileNames.filter((fileName) => !fileName.endsWith('.json'))
            const images = []
            const json = JSON.parse(jsonFileContent)

            const workId = json.collections[0].data[0].id
            const imageFileDir = path.join(app.getPath('userData'), 'images', 'import', workId)

            for (const fileName of imageFiles) {
                const imageName = path.basename(fileName)
                const content = await zip.file(fileName).async('nodebuffer')
                images.push(imageName)
                await fs.promises.mkdir(imageFileDir, { recursive: true })
                await fs.promises.writeFile(path.join(imageFileDir, imageName), content)
            }

            fs.rmSync(saveFilePath)
            return {
                images,
                imagePath: imageFileDir,
                sep: path.sep,
                data: json
            }
        })

        ipcMain.handle('show-image', async (e, filePath) => {
            const extension = path.extname(filePath)
            const img = fs.readFileSync(filePath).toString('base64')
            return `data:image/${extension};base64,${img}`
        })

        ipcMain.handle('delete-file', async (e, path) => {
            fs.rmSync(path)
        })
    })
    .catch(() => null)
