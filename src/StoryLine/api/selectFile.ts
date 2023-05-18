import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'

const selectFile = async (fileDir: string) => {
    const result = await dialog.showOpenDialog({
        title: 'Select a file',
        filters: [{ name: 'Files', extensions: ['bibisco2'] }]
    })

    if (result.canceled || !result.filePaths.length) return false

    const filePath = result.filePaths[0]
    await fs.promises.mkdir(fileDir, { recursive: true })
    const timestamp = new Date().getTime()
    const extension = path.extname(filePath)
    const fileName = `file-${timestamp}${extension}`
    const saveFilePath = path.join(fileDir, fileName)
    await fs.promises.copyFile(filePath, saveFilePath)
    return saveFilePath
}

export default selectFile
