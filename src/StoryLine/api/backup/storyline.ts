import { dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

const backupStoryLine = async (_: Electron.IpcMainInvokeEvent, jsonString: string) => {
    const images: string[] = []
    const zip = new JSZip()

    zip.file('database.json', jsonString)

    images.forEach((image: string) => {
        const data = fs.readFileSync(image)
        zip.file(`images/${path.basename(image)}`, data)
    })

    const buffer = await zip.generateAsync({ type: 'nodebuffer' })

    const result = await dialog.showSaveDialog({
        defaultPath: `StoryLine.zip`,
        filters: [
            { name: 'ZIP files', extensions: ['zip'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    })

    if (result.filePath) {
        fs.writeFile(result.filePath, buffer, () => {
            captureMessage('api.backupStoryLine write failure')
        })

        return result.filePath
    }

    return true
}

export default backupStoryLine
