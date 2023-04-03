/* eslint-disable max-nested-callbacks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from '@nozbe/watermelondb'
import { capitalize } from 'lodash'
import { DateTime } from 'luxon'
import { CharacterMode } from '@sl/constants/characterMode'
import { SectionMode } from '@sl/constants/sectionMode'
import { PointOfView } from '@sl/constants/pov'
import { Status } from '@sl/constants/status'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

// ToDo: relations, fix pov character, stats, tags

const cleanText = (text: string) => {
    return text.replace(/<[^>]*>/g, '').replace('&nbsp;', ' ')
}

const statusMap = {
    todo: Status.TODO,
    tocomplete: Status.DRAFT,
    done: Status.COMPLETE
}

const povMap = {
    '1stOnMajor': PointOfView.FIRST,
    '1stOnMinor': PointOfView.FIRST,
    '2nd': PointOfView.SECOND,
    '3rdOmniscient': PointOfView.THIRD_OMN,
    '3rdLimited': PointOfView.THIRD_LIM,
    '3rdObjective': PointOfView.THIRD_OBJ
}

const importBibisco = async (database: Database): Promise<false | string> => {
    const { images, imagePath, sep, data } = await api.importBibisco()

    if (!data) {
        return false
    }

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
                data.collections[0].data[0].meta.updated || data.collections[0].data[0].meta.created
            ).toJSDate()
        })
    })

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

    const parts = await work.parts.fetch()

    await database.write(async () => {
        return await database.batch(
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
                                          (pr) => data.position >= pr.min && data.position <= pr.max
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

    const chapters = await work.chapters.fetch()

    await database.write(async () => {
        return await database.batch(
            ...data.collections[4].data.map((data: any) =>
                database.get<SectionModel>('section').prepareCreate((section) => {
                    section._raw.id = `SCENE-${data['$loki']}`
                    section.work.set(work)
                    section.section.set(
                        chapters.find((chapter) => chapter.id === `CHAPTER-${data.chapterid}`)
                    )
                    section.mode = SectionMode.SCENE
                    section.title = data.title
                    section.order = data.position
                    section.date = data.revisions[data.revision].time
                        ? DateTime.fromISO(data.revisions[data.revision].time).toSQL()
                        : ''
                    section.body = data.revisions[data.revision].text
                    section.status = statusMap[data.status as keyof typeof statusMap]
                    section.pointOfView = data.povid
                        ? povMap[data.povid as keyof typeof povMap]
                        : null
                    section.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                    section.updatedAt = DateTime.fromMillis(
                        data.meta.updated || data.meta.created
                    ).toJSDate()
                })
            )
        )
    })

    const architectureNote = await database.write(async () => {
        return database.get<NoteModel>('note').create((note) => {
            note.work.set(work)
            note.title = 'Architecture'
            note.order = 1
            note.status = Status.TODO
        })
    })

    const strandsNote = await database.write(async () => {
        return database.get<NoteModel>('note').create((note) => {
            note.work.set(work)
            note.title = 'Narrative Strands'
            note.order = 2
            note.status = Status.TODO
        })
    })

    await database.write(async () => {
        return await database.batch(
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
            ...data.collections[8].data.map((data: any) =>
                database.get<NoteModel>('note').prepareCreate((note) => {
                    note._raw.id = `NOTE-${data['$loki']}`
                    note.work.set(work)
                    note.title = data.name
                    note.body = data.description
                    note.order = data.position
                    note.status = statusMap[data.status as keyof typeof statusMap]
                })
            ),
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
            ...data.collections[5].data.map((data: any) =>
                database.get<CharacterModel>('character').prepareCreate((character) => {
                    character._raw.id = `CHARACTER-PRIM-${data['$loki']}`
                    character.work.set(work)
                    character.mode = CharacterMode.PRIMARY
                    character.displayName = data.name
                    character.image = data.profileimage
                        ? `${imagePath}${sep}${data.profileimage}`
                        : ''
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
            ...data.collections[6].data.map((data: any) =>
                database.get<CharacterModel>('character').prepareCreate((character) => {
                    character._raw.id = `CHARACTER-SEC-${data['$loki']}`
                    character.work.set(work)
                    character.mode = CharacterMode.SECONDARY
                    character.image = data.profileimage
                        ? `${imagePath}${sep}${data.profileimage}`
                        : ''
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

    const scenes = await work.scenes.fetch()
    const characters = await work.character.fetch()
    const items = await work.item.fetch()
    const locations = await work.location.fetch()
    const notes = await work.note.fetch()

    const povScenes: SectionModel[] = data.collections[4].data
        .filter((data: any) => data.characterid)
        .reduce((arr: SectionModel[], data: any) => {
            const povScene = scenes.find((scene) => scene.id === `SCENE-${data['$loki']}`)
            const [mode, id] = data.characterid.split('_')
            const character = characters.find(
                (character) => character.id === `CHARACTER-${mode === 'm' ? 'PRIM' : 'SEC'}-${id}`
            )
            povScene.prepareUpdate((section) => {
                section.pointOfViewCharacter.set(character)
            })
            return arr
        }, [])

    if (povScenes.length) {
        await database.write(async () => {
            return await database.batch(povScenes)
        })
    }

    const versions: SectionModel[] = data.collections[4].data
        .filter((data: any) => data.revisions.length > 1)
        .reduce((arr: SectionModel[], data: any) => {
            data.revisions
                .filter((_: any, index: number) => index !== data.revision)
                .map((revision: any) =>
                    arr.push(
                        database.get<SectionModel>('section').prepareCreate((section) => {
                            section.work.set(work)
                            section.section.set(
                                scenes.find((scene) => scene.id === `SCENE-${data['$loki']}`)
                            )
                            section.mode = SectionMode.VERSION
                            section.title = data.title
                            section.order = data.position
                            section.body = revision.text
                            section.date = revision.time
                                ? DateTime.fromISO(revision.time).toSQL()
                                : ''
                            section.status = statusMap[data.status as keyof typeof statusMap]
                            section.createdAt = DateTime.fromMillis(data.meta.created).toJSDate()
                            section.updatedAt = DateTime.fromMillis(
                                data.meta.updated || data.meta.created
                            ).toJSDate()
                        })
                    )
                )
            return arr
        }, [])

    if (versions.length) {
        await database.write(async () => {
            return await database.batch(versions)
        })
    }

    if (images.length) {
        const imageNotes: NoteModel[] = data.collections.reduce(
            (arr: NoteModel[], collection: any) => {
                collection.data
                    .filter((data: any) => data.images?.length)
                    .map((data: any) => {
                        data.images.map((image: { name: string; filename: string }) => {
                            arr.push(
                                database.get<NoteModel>('note').prepareCreate((note) => {
                                    note.work.set(work)
                                    if (
                                        ['maincharacters', 'secondarycharacters'].includes(
                                            collection.name
                                        )
                                    ) {
                                        note.character.set(
                                            characters.find(
                                                (item: any) =>
                                                    item.id ===
                                                    `${
                                                        collection.name === 'maincharacters'
                                                            ? 'CHARACTER-PRIM'
                                                            : 'CHARACTER-SEC'
                                                    }-${data['$loki']}`
                                            )
                                        )
                                    } else if (collection.name === 'objects') {
                                        note.item.set(
                                            items.find(
                                                (item: any) => item.id === `ITEM-${data['$loki']}`
                                            )
                                        )
                                    } else if (collection.name === 'locations') {
                                        note.location.set(
                                            locations.find(
                                                (item: any) =>
                                                    item.id === `LOCATION-${data['$loki']}`
                                            )
                                        )
                                    } else if (collection.name === 'notes') {
                                        note.note.set(
                                            notes.find(
                                                (item: any) => item.id === `NOTE-${data['$loki']}`
                                            )
                                        )
                                    }
                                    note.title = image.name
                                    note.image = `${imagePath}${sep}${image.filename}`
                                    note.status = statusMap['done']
                                })
                            )
                        })
                    })
                return arr
            },
            []
        )

        if (imageNotes.length) {
            await database.write(async () => {
                return await database.batch(imageNotes)
            })
        }
    }

    const eventNotes: NoteModel[] = data.collections.reduce((arr: NoteModel[], collection: any) => {
        collection.data
            .filter((data: any) => data.events?.length)
            .map((data: any) => {
                data.events.map((event: { time: string; event: string }) => {
                    arr.push(
                        database.get<NoteModel>('note').prepareCreate((note) => {
                            note.work.set(work)
                            if (
                                ['maincharacters', 'secondarycharacters'].includes(collection.name)
                            ) {
                                note.character.set(
                                    characters.find(
                                        (item: any) =>
                                            item.id ===
                                            `${
                                                collection.name === 'maincharacters'
                                                    ? 'CHARACTER-PRIM'
                                                    : 'CHARACTER-SEC'
                                            }-${data['$loki']}`
                                    )
                                )
                            } else if (collection.name === 'objects') {
                                note.item.set(
                                    items.find((item: any) => item.id === `ITEM-${data['$loki']}`)
                                )
                            } else if (collection.name === 'locations') {
                                note.location.set(
                                    locations.find(
                                        (item: any) => item.id === `LOCATION-${data['$loki']}`
                                    )
                                )
                            } else if (collection.name === 'notes') {
                                note.note.set(
                                    notes.find((item: any) => item.id === `NOTE-${data['$loki']}`)
                                )
                            }
                            note.title = event.event
                            note.date = DateTime.fromISO(event.time).toSQL()
                            note.status = statusMap['done']
                        })
                    )
                })
            })
        return arr
    }, [])

    if (eventNotes.length) {
        await database.write(async () => {
            return await database.batch(eventNotes)
        })
    }

    return work.id
}

export default importBibisco
