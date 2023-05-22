import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

const restoreWork = async (baseDir: string) => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: '.slwork', extensions: ['slwork'] }]
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

    const imageFiles = fileNames.filter((fileName) =>
        ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(fileName).toLowerCase())
    )
    const json = JSON.parse(jsonFileContent)

    const workId = json.work[0].id

    if (!workId) return false

    for await (const fileName of imageFiles) {
        const targetFilePath = path.join(baseDir, fileName)
        await fs.promises.mkdir(path.dirname(targetFilePath), { recursive: true })
        const content = await zip.file(fileName).async('nodebuffer')
        fs.writeFileSync(targetFilePath, content)
    }

    fs.rmSync(saveFilePath)

    return {
        data: json
    }
}

export default restoreWork
