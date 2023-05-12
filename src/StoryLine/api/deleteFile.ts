import fs from 'fs'

const deleteFile = async (_: Electron.IpcMainInvokeEvent, path: string) => {
    if (fs.existsSync(path)) {
        fs.rmSync(path)
    }
}

export default deleteFile
