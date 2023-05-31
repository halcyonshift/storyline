import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

const restoreStoryLine = async (baseDir: string) => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: '.sldb', extensions: ['sldb'] }]
    })

    if (result.canceled || !result.filePaths.length) return false
    const filePath = result.filePaths[0]
    const fileDir = path.join(baseDir, 'restore')
    await fs.promises.mkdir(fileDir, { recursive: true })
    const saveFilePath = path.join(fileDir, 'storyline.zip')
    await fs.promises.copyFile(filePath, saveFilePath)
    const data = await fs.promises.readFile(saveFilePath)
    const zip = await JSZip.loadAsync(data)

    zip.forEach((_, zipEntry) => {
        const resolvedPath = path.join(baseDir, 'restore', zipEntry.name)
        if (!resolvedPath.startsWith(fileDir)) {
            throw Error('Path traversal detected')
        }
    })

    const fileNames = Object.keys(zip.files)

    const jsonFile = zip.file(fileNames.find((file) => file.endsWith('.json')))
    const jsonFileContent = await jsonFile.async('string')

    const imageDir = path.join(baseDir, 'images')

    fs.rmSync(imageDir, { recursive: true, force: true })

    zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && !relativePath.endsWith('.json')) {
            const contentPromise = zipEntry.async('nodebuffer')
            const targetFilePath = path.join(baseDir, relativePath)

            void contentPromise.then((content) => {
                fs.mkdirSync(path.dirname(targetFilePath), { recursive: true })
                fs.writeFileSync(targetFilePath, content)
            })
        }
    })

    fs.rmSync(fileDir, { recursive: true, force: true })

    return jsonFileContent
}

export default restoreStoryLine
