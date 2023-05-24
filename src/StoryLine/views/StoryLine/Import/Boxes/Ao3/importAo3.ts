/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from '@nozbe/watermelondb'
import { DateTime } from 'luxon'
import { SectionMode } from '@sl/constants/sectionMode'
import { Status } from '@sl/constants/status'
import { SectionModel, StatisticModel, WorkModel } from '@sl/db/models'
import { cleaner, wordCount } from '@sl/utils'

const importAo3 = async (
    workOrSeriesId: number,
    mode: 'series' | 'work',
    database: Database
): Promise<false | string> => {
    const { title, works } = await api.importAo3(workOrSeriesId, mode)

    if (!works.length) {
        return false
    }

    const work = await database.write(async () => {
        return await database.get<WorkModel>('work').create((work) => {
            work.title = title || works[0].work.title
            work.author = works[0].work.creator
            work.language = works[0].work.language
            work.status = Status.TODO
            work.createdAt = DateTime.fromISO(works[0].work.date).toJSDate()
            work.updatedAt = DateTime.fromISO(works[0].work.date).toJSDate()
        })
    })

    let partOrder = 1

    for await (const _work of works) {
        const part = await database.write(async () => {
            return await database.get<SectionModel>('section').create((section) => {
                section._raw.id = `${work.id}-PART-${_work.work.UUID}`
                section.work.set(work)
                section.mode = SectionMode.PART
                section.title = _work.work.title
                section.order = partOrder
                section.status = Status.TODO
                section.description = _work.work.description
            })
        })

        partOrder += 1

        await database.write(async () => {
            return await database.batch(
                ..._work.chapters.map((chapter: any, index: number) =>
                    database.get<SectionModel>('section').prepareCreate((section) => {
                        section._raw.id = `${work.id}-${_work.work.UUID}-CHAPTER-${index}`
                        section.work.set(work)
                        section.section.set(part)
                        section.mode = SectionMode.CHAPTER
                        section.title = chapter.title
                        section.order = chapter.order
                        section.status = Status.TODO
                    })
                )
            )
        })

        const chapters = await part.chapters.fetch()

        await database.write(async () => {
            return await database.batch(
                ..._work.chapters.map((scene: any, index: number) =>
                    database.get<SectionModel>('section').prepareCreate((section) => {
                        section._raw.id = `${work.id}-${_work.work.UUID}-SCENE-${index}`
                        section.work.set(work)
                        section.section.set(chapters[index])
                        section.mode = SectionMode.SCENE
                        section.order = 1
                        section.body = cleaner(scene.text)
                        section.words = wordCount(scene.text)
                        section.status = Status.TODO
                    })
                )
            )
        })
    }

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

export default importAo3
