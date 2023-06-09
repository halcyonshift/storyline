import { dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import { htmlToText } from 'html-to-text'
import kebabCase from 'lodash/kebabCase'

const exportText = async (_: Electron.IpcMainInvokeEvent, fileName: string, html: string) => {
    const result = await dialog.showSaveDialog({
        defaultPath: `${kebabCase(fileName)}.txt`,
        filters: [{ name: '.txt', extensions: ['*'] }]
    })

    if (result.filePath) {
        fs.writeFile(result.filePath, htmlToText(html), () => {
            captureMessage('api.export-txt write failure')
        })

        return result.filePath
    }
}

export default exportText
