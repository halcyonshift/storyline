import { dialog } from 'electron'
import { kebabCase } from 'lodash'
import * as htmlToRtf from 'html-to-rtf'
import * as ansiEncode from 'ansi-encode'

const exportRTF = async (_: Electron.IpcMainInvokeEvent, fileName: string, html: string) => {
    const result = await dialog.showSaveDialog({
        defaultPath: `${kebabCase(fileName)}.rtf`,
        filters: [{ name: '.rtf', extensions: ['*'] }]
    })

    if (result.filePath) {
        html = ansiEncode(html).replace(/u00/gi, "'")
        htmlToRtf.saveRtfInFile(result.filePath, htmlToRtf.convertHtmlToRtf(html))
        return result.filePath
    }
}

export default exportRTF
