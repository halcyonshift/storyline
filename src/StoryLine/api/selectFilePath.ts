import { dialog } from 'electron'

const exportFilePath = async () => {
    const filePath = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
    })
    return filePath.canceled || !filePath.filePaths.length ? '' : filePath.filePaths[0]
}

export default exportFilePath
