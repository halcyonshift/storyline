/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from '@nozbe/watermelondb'
import { DateTime } from 'luxon'
import { SectionMode } from '@sl/constants/sectionMode'
import { Status } from '@sl/constants/status'
import { SectionModel, StatisticModel, WorkModel } from '@sl/db/models'
import { wordCount } from '@sl/utils'
import { importCleaner } from '../../utils'

const importEPub = async (database: Database): Promise<false | string> => {
    const data = await api.importEPub()

    if (!data.work) {
        return false
    }

    try {
        await database.get<WorkModel>('work').find(data.work.UUID)
        return false
    } catch {
        //
    }

    const date = DateTime.fromISO(data.work.date).toJSDate()

    const work = await database.write(async () => {
        return await database.get<WorkModel>('work').create((work) => {
            work._raw.id = data.work.UUID
            work.title = data.work.title
            work.author = data.work.creator
            work.language = data.work.language
            work.summary = data.work.description
            work.status = Status.TODO
            work.createdAt = date
            work.updatedAt = date
        })
    })

    const part = await work.addPart()

    await database.write(async () => {
        return await database.batch(
            ...data.chapters.map((chapter: any, index: number) =>
                database.get<SectionModel>('section').prepareCreate((section) => {
                    section._raw.id = `${data.work.UUID}-CHAPTER-${index}`
                    section.work.set(work)
                    section.section.set(part)
                    section.mode = SectionMode.CHAPTER
                    section.title = chapter.title
                    section.order = chapter.order
                    section.status = Status.TODO
                    section.createdAt = date
                    section.updatedAt = date
                })
            )
        )
    })

    const chapters = await work.chapters.fetch()

    await database.write(async () => {
        return await database.batch(
            ...data.chapters.map((scene: any, index: number) =>
                database.get<SectionModel>('section').prepareCreate((section) => {
                    section._raw.id = `${data.work.UUID}-SCENE-${index}`
                    section.work.set(work)
                    section.section.set(chapters[index])
                    section.mode = SectionMode.SCENE
                    section.order = 1
                    section.body = importCleaner(scene.text)
                    section.words = wordCount(importCleaner(scene.text))
                    section.status = Status.TODO
                    section.createdAt = date
                    section.updatedAt = date
                })
            )
        )
    })

    const scenes = await work.scenes.fetch()

    const statistics: StatisticModel[] = scenes.reduce(
        (arr: StatisticModel[], scene: SectionModel) => {
            arr.push(
                database.get<StatisticModel>('statistic').prepareCreate((statistic) => {
                    statistic.work.set(work)
                    statistic.section.set(scene)
                    statistic.words = scene.words
                    statistic.createdAt = scene.updatedAt
                    statistic.updatedAt = scene.updatedAt
                })
            )
            return arr
        },
        []
    )

    if (statistics.length) {
        await database.write(async () => {
            return await database.batch(statistics)
        })
    }

    return work.id
}

export default importEPub
