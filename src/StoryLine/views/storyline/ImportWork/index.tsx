/* eslint-disable complexity */
import { Box, Button, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import * as Q from '@nozbe/watermelondb/QueryDescription'
import { capitalize } from 'lodash'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { CharacterMode } from '@sl/constants/characterMode'
import { SectionMode } from '@sl/constants/sectionMode'
import { Status } from '@sl/constants/status'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

const ImportWorkView = () => {
    const database = useDatabase()
    const { t } = useTranslation()

    const cleanText = (text: string) => {
        return text.replace(/<[^>]*>/g, '').replace('&nbsp;', ' ')
    }

    const importBibisco = async () => {
        const statusMap = {
            todo: Status.TODO,
            tocomplete: Status.DRAFT,
            done: Status.COMPLETE
        }
        const data = await api.importBibisco()

        // work
        const work = await database.write(async () => {
            return await database.get<WorkModel>('work').create((work) => {
                work._raw.id = data.collections[0].data[0].id
                work.title = data.collections[0].data[0].name
                work.author = data.collections[0].data[0].author
                work.language = data.collections[0].data[0].language
                work.status = Status.TODO
                work.wordGoal = data.collections[0].data[0].wordsGoal
                work.wordGoalPerDay = data.collections[0].data[0].wordsPerDayGoal
                work.deadlineAt = data.collections[0].data[0].deadline
                    ? DateTime.fromISO(data.collections[0].data[0].deadline).toJSDate()
                    : null
                work.createdAt = DateTime.fromMillis(
                    data.collections[0].data[0].meta.created
                ).toJSDate()
                work.updatedAt = DateTime.fromMillis(
                    data.collections[0].data[0].meta.updated ||
                        data.collections[0].data[0].meta.created
                ).toJSDate()
            })
        })

        // parts
        let part: SectionModel
        const partRange: { id: string; min: number; max: number }[] = []

        let min = 1
        for (const part of data.collections[10].data) {
            partRange.push({
                id: `PART-${part['$loki']}`,
                min,
                max: part.chaptersincluded - 1 + min
            })

            min += part.chaptersincluded - 1 + min
        }

        if (data.collections[10].data.length) {
            await database.write(async () => {
                return await database.batch(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...data.collections[10].data.map((data: any) =>
                        database.get<SectionModel>('section').prepareCreate((section) => {
                            section._raw.id = `PART-${data['$loki']}`
                            section.work.set(work)
                            section.mode = SectionMode.PART
                            section.title = data.title
                            section.order = data.position
                            section.status = statusMap[data.status as keyof typeof statusMap]
                            section.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                            section.updatedAt = DateTime.fromMillis(
                                data.meta.updated || data.meta.created
                            ).toJSDate()
                        })
                    )
                )
            })
        } else {
            part = await work.addPart()
            partRange.push({ id: part.id, min: 0, max: 10000000 })
        }

        const parts = await database
            .get<SectionModel>('section')
            .query(Q.where('work_id', work.id), Q.where('mode', SectionMode.PART))
            .fetch()

        // chapters

        await database.write(async () => {
            return await database.batch(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...data.collections[3].data.map((data: any) =>
                    database.get<SectionModel>('section').prepareCreate((section) => {
                        section._raw.id = `CHAPTER-${data['$loki']}`
                        section.work.set(work)
                        section.section.set(
                            parts.find(
                                (part) =>
                                    part.id ===
                                    (data.position === -2
                                        ? partRange[partRange.length - 1]
                                        : data.position === -1
                                        ? partRange[0]
                                        : partRange.find(
                                              // eslint-disable-next-line max-nested-callbacks
                                              (pr) =>
                                                  data.position >= pr.min && data.position <= pr.max
                                          ) || partRange[partRange.length - 1]
                                    ).id
                            )
                        )
                        section.mode = SectionMode.CHAPTER
                        section.title = data.title
                        section.order = data.position
                        section.body = data.reason.text
                        section.status = statusMap[data.status as keyof typeof statusMap]
                        section.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                        section.updatedAt = DateTime.fromMillis(
                            data.meta.updated || data.meta.created
                        ).toJSDate()
                    })
                )
            )
        })

        const chapters = await database
            .get<SectionModel>('section')
            .query(Q.where('work_id', work.id), Q.where('mode', SectionMode.CHAPTER))
            .fetch()

        // scenes

        if (data.collections[4].data.length) {
            await database.write(async () => {
                return await database.batch(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...data.collections[4].data.map((data: any) =>
                        database.get<SectionModel>('section').prepareCreate((section) => {
                            section._raw.id = `SCENE-${data['$loki']}`
                            section.work.set(work)
                            section.section.set(
                                chapters.find(
                                    (chapter) => chapter.id === `CHAPTER-${data.chapterid}`
                                )
                            )
                            section.mode = SectionMode.SCENE
                            section.title = data.title
                            section.order = data.position
                            section.body = data.revisions[data.revisions.length - 1].text
                            section.status = statusMap[data.status as keyof typeof statusMap]
                            section.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                            section.updatedAt = DateTime.fromMillis(
                                data.meta.updated || data.meta.created
                            ).toJSDate()
                        })
                    )
                )
            })
        }

        // and the rest

        const architectureNote = await database.write(async () => {
            return database.get<NoteModel>('note').prepareCreate((note) => {
                note.work.set(work)
                note.title = 'Architecture'
                note.order = 1
            })
        })

        const strandsNote = await database.write(async () => {
            return database.get<NoteModel>('note').prepareCreate((note) => {
                note.work.set(work)
                note.title = 'Narrative Strands'
                note.order = 1
            })
        })

        await database.write(async () => {
            return await database.batch(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...data.collections[1].data.map((data: any) =>
                    database.get<NoteModel>('note').prepareCreate((note) => {
                        note._raw.id = `NOTE-A-${data['$loki']}`
                        note.work.set(work)
                        note.note.set(architectureNote)
                        note.title = capitalize(data.type)
                        note.body = data.text
                        note.order = data.position
                        note.status = statusMap[data.status as keyof typeof statusMap]
                    })
                ),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...data.collections[2].data.map((data: any) =>
                    database.get<NoteModel>('note').prepareCreate((note) => {
                        note._raw.id = `NOTE-S-${data['$loki']}`
                        note.work.set(work)
                        note.note.set(strandsNote)
                        note.title = data.name
                        note.body = data.description
                        note.order = data.position
                        note.status = statusMap[data.status as keyof typeof statusMap]
                    })
                ),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...data.collections[9].data.map((data: any) =>
                    database.get<ItemModel>('item').prepareCreate((item) => {
                        item._raw.id = `ITEM-${data['$loki']}`
                        item.work.set(work)
                        item.name = data.name
                        item.body = data.description
                        item.status = statusMap[data.status as keyof typeof statusMap]
                        item.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                        item.updatedAt = DateTime.fromMillis(
                            data.meta.updated || data.meta.created
                        ).toJSDate()
                    })
                ),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...data.collections[7].data.map((data: any) =>
                    database.get<LocationModel>('location').prepareCreate((location) => {
                        location._raw.id = `LOCATION-${data['$loki']}`
                        location.work.set(work)
                        location.name = data.location
                        location.body = data.description
                        location.status = statusMap[data.status as keyof typeof statusMap]
                        location.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                        location.updatedAt = DateTime.fromMillis(
                            data.meta.updated || data.meta.created
                        ).toJSDate()
                    })
                ),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...data.collections[5].data.map((data: any) =>
                    database.get<CharacterModel>('character').prepareCreate((character) => {
                        character._raw.id = `CHARACTER-PRIM-${data['$loki']}`
                        character.work.set(work)
                        character.mode = CharacterMode.PRIMARY
                        character.displayName = data.name
                        character.firstName = cleanText(data.personaldata.questions[0].text)
                        character.lastName = cleanText(data.personaldata.questions[1].text)
                        character.nickname = cleanText(data.personaldata.questions[2].text)
                        character.gender = cleanText(data.personaldata.questions[3].text)
                        character.apparentAge = cleanText(data.personaldata.questions[4].text)
                        character.placeOfBirth = cleanText(data.personaldata.questions[5].text)
                        character.residence = cleanText(data.personaldata.questions[6].text)
                        character.education = cleanText(data.personaldata.questions[7].text)
                        character.profession = cleanText(data.personaldata.questions[8].text)
                        character.finances = cleanText(data.personaldata.questions[9].text)
                        character.ethnicity = cleanText(data.physionomy.questions[0].text)
                        character.height = cleanText(data.physionomy.questions[1].text)
                        character.build = cleanText(data.physionomy.questions[2].text)
                        character.hair = cleanText(data.physionomy.questions[3].text)
                        character.face = cleanText(`${data.physionomy.questions[4].text}
                        ${data.physionomy.questions[5].text}
                        ${data.physionomy.questions[6].text}`)
                        character.distinguishingFeatures =
                            cleanText(`${data.physionomy.questions[22].text}
                        ${data.physionomy.questions[23].text}`)
                        character.religion = cleanText(data.ideas.questions[0].text)
                        character.politicalLeaning = cleanText(data.ideas.questions[2].text)
                        character.description = data.description
                        character.history = data.lifebeforestorybeginning
                        character.status = statusMap[data.status as keyof typeof statusMap]
                        character.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                        character.updatedAt = DateTime.fromMillis(
                            data.meta.updated || data.meta.created
                        ).toJSDate()
                    })
                ),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...data.collections[6].data.map((data: any) =>
                    database.get<CharacterModel>('character').prepareCreate((character) => {
                        character._raw.id = `CHARACTER-SEC-${data['$loki']}`
                        character.work.set(work)
                        character.mode = CharacterMode.SECONDARY
                        character.displayName = data.name
                        character.description = data.description
                        character.status = statusMap[data.status as keyof typeof statusMap]
                        character.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                        character.updatedAt = DateTime.fromMillis(
                            data.meta.updated || data.meta.created
                        ).toJSDate()
                    })
                )
            )
        })
    }

    return (
        <Box>
            <Typography variant='h4'>{t('view.storyline.importWork.title')}</Typography>
            <Button onClick={importBibisco}>{t('view.storyline.importWork.bibisco')}</Button>
        </Box>
    )
}

export default ImportWorkView
