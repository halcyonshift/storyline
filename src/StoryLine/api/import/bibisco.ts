import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

const bibisco = async (baseDir: string) => {
    const result = await dialog.showOpenDialog({
        title: 'Select .bibisco2 archive',
        filters: [{ name: 'Files', extensions: ['bibisco2'] }]
    })
    if (result.canceled || !result.filePaths.length) return false
    const filePath = result.filePaths[0]
    const fileDir = path.join(baseDir, 'import')
    await fs.promises.mkdir(fileDir, { recursive: true })
    const saveFilePath = path.join(fileDir, 'archive.bibisco2')
    await fs.promises.copyFile(filePath, saveFilePath)
    const data = await fs.promises.readFile(saveFilePath)
    const zip = await JSZip.loadAsync(data)
    const fileNames = Object.keys(zip.files)

    const jsonFile = zip.file(fileNames.find((file) => file.endsWith('.json')))
    const jsonFileContent = await jsonFile.async('string')

    const imageFiles = fileNames.filter((fileName) => !fileName.endsWith('.json'))
    const images = []
    const json = JSON.parse(jsonFileContent)

    const workId = json.collections[0].data[0].id
    const imageFileDir = path.join(baseDir, 'images', 'import', workId)

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

export default bibisco
