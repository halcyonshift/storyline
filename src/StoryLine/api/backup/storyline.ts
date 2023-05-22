import { app, dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import JSZip from 'jszip'
import { DateTime } from 'luxon'
import path from 'path'
import { walk } from '../utils'

const backupStoryLine = async (_: Electron.IpcMainInvokeEvent, jsonString: string) => {
    const zip = new JSZip()

    zip.file('database.json', jsonString)

    const imageDir = path.join(app.getPath('userData'), 'images')
    const imageFiles = await walk(imageDir)
    const imagesFolder = zip.folder('images')

    for (const imageFile of imageFiles.flat(Number.POSITIVE_INFINITY)) {
        imagesFolder.file(imageFile.replace(imageDir, ''), fs.readFileSync(imageFile))
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer' })

    const result = await dialog.showSaveDialog({
        defaultPath: `${DateTime.now().toFormat('yyyyMMddHmm')}.sldb`,
        filters: [{ name: '.sldb', extensions: ['sldb'] }]
    })

    if (result.filePath) {
        fs.writeFile(result.filePath, buffer, () => {
            captureMessage('api.backupStoryLine write failure')
        })

        return result.filePath
    }

    return false
}

export default backupStoryLine
