import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'

const selectImage = async (fileDir: string) => {
    const result = await dialog.showOpenDialog({
        title: 'Select an image',
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
    })

    if (result.canceled || !result.filePaths.length) return false

    const filePath = result.filePaths[0]

    await fs.promises.mkdir(fileDir, { recursive: true })
    const saveFilePath = path.join(
        fileDir,
        `image-${new Date().getTime()}${path.extname(filePath)}`
    )
    await fs.promises.copyFile(filePath, saveFilePath)

    return saveFilePath
}

export default selectImage
