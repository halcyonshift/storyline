import { dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import { kebabCase } from 'lodash'

const exportHTML = async (_: Electron.IpcMainInvokeEvent, fileName: string, html: string) => {
    const result = await dialog.showSaveDialog({
        defaultPath: `${kebabCase(fileName)}.html`,
        filters: [{ name: 'All Files', extensions: ['*'] }]
    })

    if (result.filePath) {
        fs.writeFile(result.filePath, html, () => {
            captureMessage('api.export-html write failure')
        })

        return result.filePath
    }
}

export default exportHTML
