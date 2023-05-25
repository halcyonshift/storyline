import axios from 'axios'
import * as cheerio from 'cheerio'
import EPub from 'epub'
import fs from 'fs'
import { DateTime } from 'luxon'
import path from 'path'

type ChapterType = {
    title: string
    order: number
    text: string
}

type WorkType = {
    work: EPub.Metadata
    chapters: ChapterType[]
}

type DataType = {
    title: string
    works: WorkType[]
}

const ao3 = async (baseDir: string, id: number, mode: 'series' | 'work') => {
    if (!id || !mode || !['series', 'work'].includes(mode)) return false
    let ids: string[] = []

    const data: DataType = {
        title: '',
        works: []
    }

    if (mode === 'series') {
        try {
            const response = await axios.get(`https://archiveofourown.org/series/${id}`, {
                responseType: 'document'
            })
            const $ = cheerio.load(response.data)

            const works = $('ul.series > li .heading > a[href^="/works/"]')
            ids = works.map((index, element) => $(element).attr('href').split('/')[2]).get()

            data.title = $('h2.heading').text()
        } catch {
            return false
        }
    } else {
        ids = [id.toString()]
    }

    if (!ids.length) return

    for await (const id of ids) {
        const fileUrl =
            `https://archiveofourown.org/downloads/${id}/ao3.epub?` +
            `updated_at=${DateTime.now().valueOf()}`

        const filePath = path.join(baseDir, 'import', 'ao3.epub')
        const fileDir = path.join(baseDir, 'import')

        try {
            const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })
            fs.writeFileSync(filePath, response.data)
        } catch {
            return false
        }

        const work: WorkType = await new Promise((resolve) => {
            const epub = new EPub(filePath, fileDir, fileDir)
            epub.on('end', async () => {
                const work = epub.metadata
                const chapters: ChapterType[] = []
                let c = 0
                for await (const chapter of epub.flow) {
                    const text: string = await new Promise((resolve) => {
                        epub.getChapter(chapter.id, (_, text) => {
                            resolve(text)
                        })
                    })
                    const tocItem = epub.toc[c]

                    chapters.push({
                        title: tocItem?.title || '',
                        order: tocItem?.order || 0,
                        text
                    })
                    c += 1
                }
                resolve({ work, chapters: chapters.slice(2, -1).concat() })
            })

            epub.parse()
        })

        data.works.push(work)
    }

    fs.rmSync(path.join(baseDir, 'import', 'ao3.epub'))

    return data
}

export default ao3
