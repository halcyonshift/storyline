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

// eslint-disable-next-line complexity
const ao3 = async (baseDir: string, id: number, mode: 'series' | 'work') => {
    if (!id || id < 0 || id > 1000000000 || !mode || !['series', 'work'].includes(mode))
        return false

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

            if (!ids.length) return false

            data.title = $('h2.heading')
                .text()
                .replace(/ {2}|\r\n|\n|\r|\t/gm, '')
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

                for await (const chapter of epub.toc) {
                    const chapterId = epub.flow.find(
                        (flow) => decodeURI(flow.href) === decodeURI(chapter.href)
                    )?.id

                    if (!chapterId) continue

                    const text: string = await new Promise((resolve) => {
                        epub.getChapter(chapterId, (_, text) => {
                            resolve(text)
                        })
                    })

                    chapters.push({
                        title: chapter.title,
                        order: chapter.order - 1,
                        text
                    })
                }

                resolve({ work, chapters: chapters.slice(1, -1) })
            })

            epub.parse()
        })

        data.works.push(work)
    }

    fs.rmSync(path.join(baseDir, 'import', 'ao3.epub'))

    return data
}

export default ao3
