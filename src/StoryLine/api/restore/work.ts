import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

const restoreWork = async (baseDir: string) => {
    const result = await dialog.showOpenDialog({
        title: 'Select StoryLine archive',
        filters: [{ name: 'Files', extensions: ['zip'] }]
    })
    if (result.canceled || !result.filePaths.length) return false
    const filePath = result.filePaths[0]
    const fileDir = path.join(baseDir, 'import')
    await fs.promises.mkdir(fileDir, { recursive: true })
    const saveFilePath = path.join(fileDir, 'restore.zip')
    await fs.promises.copyFile(filePath, saveFilePath)
    const data = await fs.promises.readFile(saveFilePath)
    const zip = await JSZip.loadAsync(data)
    const fileNames = Object.keys(zip.files)

    const jsonFile = zip.file(fileNames.find((file) => file.endsWith('.json')))
    const jsonFileContent = await jsonFile.async('string')

    const imageFiles = fileNames.filter(
        (fileName) => !fileName.endsWith('.json') && fileName.includes('.')
    )
    const json = JSON.parse(jsonFileContent)

    const workId = json.work[0].id

    if (!workId) return false

    const imageFileDir = path.join(baseDir, 'images', 'import', workId)
    const images = []

    for (const fileName of imageFiles) {
        const imageName = path.basename(fileName)
        const content = await zip.file(fileName).async('nodebuffer')
        images.push(imageName)
        await fs.promises.mkdir(imageFileDir, { recursive: true })
        await fs.promises.writeFile(path.join(imageFileDir, imageName), content)
    }

    fs.rmSync(saveFilePath)

    return {
        images,
        imagePath: imageFileDir,
        sep: path.sep,
        data: json
    }
}

export default restoreWork
