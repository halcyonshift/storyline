import { app, dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import kebabCase from 'lodash/kebabCase'
import path from 'path'
import JSZip from 'jszip'

const backupWork = async (
    _: Electron.IpcMainInvokeEvent,
    json: { work: { title: string }[] },
    images: string[],
    localPath: string
) => {
    const zip = new JSZip()
    zip.file(`${kebabCase(json.work[0].title)}.json`, JSON.stringify(json))

    const imageDir = path.join(app.getPath('userData'), 'images')

    const imagesFolder = zip.folder('images')
    images.forEach((image: string) => {
        try {
            const data = fs.readFileSync(image)
            imagesFolder.file(image.replace(imageDir, ''), data)
        } catch {
            //
        }
    })

    const buffer = await zip.generateAsync({ type: 'nodebuffer' })

    if (localPath) {
        const fileSavePath = `${localPath}${path.sep}${kebabCase(
            json.work[0].title
        )}-${Date.now().toString()}.slwork`
        fs.writeFile(fileSavePath, buffer, () => {
            captureMessage('api.backup with localPath write failure')
        })
        return fileSavePath
    } else {
        const result = await dialog.showSaveDialog({
            defaultPath: `${kebabCase(json.work[0].title)}.slwork`,
            filters: [{ name: '.slwork', extensions: ['slwork'] }]
        })

        if (result.filePath) {
            fs.writeFile(result.filePath, buffer, () => {
                captureMessage('api.backup without localPath write failure')
            })

            return result.filePath
        }
    }

    return false
}

export default backupWork
