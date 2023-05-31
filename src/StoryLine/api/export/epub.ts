import { dialog } from 'electron'
import { captureMessage } from '@sentry/electron/main'
import fs from 'fs'
import { kebabCase } from 'lodash'
import { default as _epub, Content, Options } from 'epub-gen-memory'

const epub = async (
    _: Electron.IpcMainInvokeEvent,
    fileName: string,
    options: Options,
    chapters: Content
) => {
    const result = await dialog.showSaveDialog({
        defaultPath: `${kebabCase(fileName)}.epub`,
        filters: [{ name: '.epub', extensions: ['*'] }]
    })

    if (result.filePath) {
        const file = await _epub(options, chapters)

        fs.writeFile(result.filePath, file, () => {
            captureMessage('api.export-epub write failure')
        })

        return result.filePath
    }
}

export default epub
