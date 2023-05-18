import fs from 'fs'
import path from 'path'

const showImage = async (_: Electron.IpcMainInvokeEvent, filePath: string) => {
    if (fs.existsSync(filePath)) {
        const extension = path.extname(filePath)
        const img = fs.readFileSync(filePath).toString('base64')
        return `data:image/${extension};base64,${img}`
    }

    return ''
}

export default showImage
