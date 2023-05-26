import { dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import { kebabCase } from 'lodash'
import TurndownService from 'turndown'

const exportMarkdown = async (_: Electron.IpcMainInvokeEvent, fileName: string, html: string) => {
    const result = await dialog.showSaveDialog({
        defaultPath: `${kebabCase(fileName)}.md`,
        filters: [{ name: '.md', extensions: ['*'] }]
    })

    if (result.filePath) {
        const text = new TurndownService()
        fs.writeFile(result.filePath, text.turndown(html), () => {
            captureMessage('api.export-md write failure')
        })

        return result.filePath
    }
}

export default exportMarkdown
