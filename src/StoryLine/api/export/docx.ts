import { dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import { kebabCase } from 'lodash'
import HTMLtoDOCX from 'html-to-docx'

const docx = async (_: Electron.IpcMainInvokeEvent, fileName: string, html: string) => {
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
            captureMessage('api.export-docx write failure')
        })

        return result.filePath
    }
}

export default docx
