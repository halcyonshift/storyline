import { dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import { kebabCase } from 'lodash'
import path from 'path'
import JSZip from 'jszip'

const backup = async (
    _: Electron.IpcMainInvokeEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: any,
    images: string[],
    localPath: string
) => {
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
            captureMessage('api.backup with localPath write failure')
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
                captureMessage('api.backup without localPath write failure')
            })

            return result.filePath
        }
    }

    return false
}

export default backup
