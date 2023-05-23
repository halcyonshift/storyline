import { dialog } from 'electron'
import EPub from 'epub'
import fs from 'fs'
import path from 'path'

const epub = async (baseDir: string) => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: '.epub', extensions: ['epub'] }]
    })
    if (result.canceled || !result.filePaths.length) return false
    const filePath = result.filePaths[0]
    const fileDir = path.join(baseDir, 'import')
    await fs.promises.mkdir(fileDir, { recursive: true })
    const saveFilePath = path.join(fileDir, 'archive.epub')
    await fs.promises.copyFile(filePath, saveFilePath)

    const data: {
        work: EPub.Metadata
        chapters: { title: string; order: number; text: string }[]
    } = await new Promise((resolve) => {
        const epub = new EPub(saveFilePath, fileDir, fileDir)
        epub.on('end', async () => {
            const work = epub.metadata
            const chapters: { title: string; order: number; text: string }[] = []
            let c = 0
            for await (const chapter of epub.flow) {
                const text: string = await new Promise((resolve) => {
                    epub.getChapter(chapter.id, (_, text) => {
                        resolve(text)
                    })
                })
                chapters.push({
                    title: epub.toc[c]?.title || '',
                    order: epub.toc[c]?.order || 0,
                    text
                })
                c += 1
            }

            resolve({ work, chapters })
        })

        epub.parse()
    })

    fs.rmSync(saveFilePath)

    return data
}

export default epub
