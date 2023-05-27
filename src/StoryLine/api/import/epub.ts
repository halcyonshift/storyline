import { dialog } from 'electron'
import EPub from 'epub'
import fs from 'fs'
import path from 'path'
import { confirmationDialog } from './utils'

const epub = async (baseDir: string) => {
    const check = await confirmationDialog()

    if (!check) return false

    const result = await dialog.showOpenDialog({
        filters: [{ name: '.epub', extensions: ['*'] }]
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

            for await (const chapter of epub.toc) {
                const id = epub.flow.find(
                    (flow) => decodeURI(flow.href) === decodeURI(chapter.href)
                )?.id

                if (!id) continue

                const text: string = await new Promise((resolve) => {
                    epub.getChapter(id, (_, text) => {
                        resolve(text)
                    })
                })

                chapters.push({
                    title: chapter.title,
                    order: chapter.order,
                    text
                })
            }

            resolve({ work, chapters })
        })

        epub.parse()
    })

    fs.rmSync(saveFilePath)

    return data
}

export default epub
