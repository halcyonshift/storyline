import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

const restoreStoryLine = async (baseDir: string) => {
    const result = await dialog.showOpenDialog({
        title: 'Select StoryLine archive',
        filters: [{ name: 'Files', extensions: ['zip'] }]
    })

    if (result.canceled || !result.filePaths.length) return false
    const filePath = result.filePaths[0]
    const fileDir = path.join(baseDir, 'import')
    await fs.promises.mkdir(fileDir, { recursive: true })
    const saveFilePath = path.join(fileDir, 'storyline.zip')
    await fs.promises.copyFile(filePath, saveFilePath)
    const data = await fs.promises.readFile(saveFilePath)
    const zip = await JSZip.loadAsync(data)
    const fileNames = Object.keys(zip.files)

    const jsonFile = zip.file(fileNames.find((file) => file.endsWith('.json')))
    const jsonFileContent = await jsonFile.async('string')

    return jsonFileContent
}

export default restoreStoryLine
