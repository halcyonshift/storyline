/* eslint-disable complexity */
import { Box, Button, Typography } from '@mui/material'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { capitalize } from 'lodash'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { CharacterMode } from '@sl/constants/characterMode'
import { SectionMode } from '@sl/constants/sectionMode'
import { Status } from '@sl/constants/status'
import { CharacterModel, ItemModel, LocationModel, SectionModel, WorkModel } from '@sl/db/models'

const ImportWorkView = () => {
    const database = useDatabase()
    const { t } = useTranslation()

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
        const partRange = []
        if (data.collections[10].data.length) {
            let min = 1
            for await (const part of data.collections[10].data) {
                const newPart = await database.write(async () => {
                    return await database.get<SectionModel>('section').create((section) => {
                        section._raw.id = `PART-${part['$loki']}`
                        section.work.set(work)
                        section.mode = SectionMode.PART
                        section.title = part.title
                        section.order = part.position
                        section.status = statusMap[part.status as keyof typeof statusMap]
                        section.createdAt = DateTime.fromMillis(part.meta.created).toJSDate()
                        section.updatedAt = DateTime.fromMillis(
                            part.meta.updated || part.meta.created
                        ).toJSDate()
                    })
                })
                partRange.push({
                    part: newPart,
                    min,
                    max: part.chaptersincluded - 1 + min
                })

                min += part.chaptersincluded - 1 + min
            }
        } else {
            part = await work.addPart()
            partRange.push({ part, chaptersIncluded: 1000000 })
        }

        // chapters
        const chapters: SectionModel[] = []
        if (data.collections[3].data.length) {
            for await (const chapter of data.collections[3].data) {
                const chapterPart =
                    chapter.position === -2
                        ? partRange[partRange.length - 1]
                        : chapter.position === -1
                        ? partRange[0]
                        : partRange.find(
                              (pr) => chapter.position >= pr.min && chapter.position <= pr.max
                          ) || partRange[partRange.length - 1]
                const newChapter = await database.write(async () => {
                    return await database.get<SectionModel>('section').create((section) => {
                        section._raw.id = `CHAPTER-${chapter['$loki']}`
                        section.work.set(work)
                        section.section.set(chapterPart.part)
                        section.mode = SectionMode.CHAPTER
                        section.title = chapter.title
                        section.order = chapter.position
                        section.body = chapter.reason.text
                        section.status = statusMap[chapter.status as keyof typeof statusMap]
                        section.createdAt = DateTime.fromMillis(chapter.meta.created).toJSDate()
                        section.updatedAt = DateTime.fromMillis(
                            chapter.meta.updated || chapter.meta.created
                        ).toJSDate()
                    })
                })
                chapters.push(newChapter)
            }
        }

        // scenes
        if (data.collections[4].data.length) {
            for await (const scene of data.collections[4].data) {
                const sceneChapter = chapters.find(
                    (chapter) => chapter.id === `CHAPTER-${scene.chapterid}`
                )
                await database.write(async () => {
                    return await database.get<SectionModel>('section').create((section) => {
                        section._raw.id = `SCENE-${scene['$loki']}`
                        section.work.set(work)
                        section.section.set(sceneChapter)
                        section.mode = SectionMode.SCENE
                        section.title = scene.title
                        section.order = scene.position
                        section.body = scene.revisions[scene.revisions.length - 1].text
                        section.status = statusMap[scene.status as keyof typeof statusMap]
                        section.createdAt = DateTime.fromMillis(scene.meta.created).toJSDate()
                        section.updatedAt = DateTime.fromMillis(
                            scene.meta.updated || scene.meta.created
                        ).toJSDate()
                    })
                })
            }
        }

        // notes - architecture

        if (data.collections[1].data.length) {
            const architectureNote = await work.addNote({
                title: 'Architecture',
                order: 1
            })

            for await (const note of data.collections[1].data) {
                await architectureNote.addNote({
                    title: capitalize(note.type),
                    body: note.text,
                    order: note.position,
                    status: statusMap[note.status as keyof typeof statusMap]
                })
            }
        }

        // notes - narrative strands

        if (data.collections[2].data.length) {
            const strandsNote = await work.addNote({
                title: 'Narrative Strands',
                order: 1
            })

            for await (const note of data.collections[2].data) {
                await strandsNote.addNote({
                    title: note.name,
                    body: note.description,
                    order: note.position,
                    status: statusMap[note.status as keyof typeof statusMap]
                })
            }
        }

        // notes - narrative strands

        if (data.collections[8].data.length) {
            for await (const note of data.collections[8].data) {
                await work.addNote({
                    title: note.name,
                    body: note.description,
                    order: note.position,
                    status: statusMap[note.status as keyof typeof statusMap]
                })
            }
        }

        // items
        if (data.collections[9].data.length) {
            for await (const _item of data.collections[9].data) {
                await database.write(async () => {
                    return await database.get<ItemModel>('item').create((item) => {
                        item._raw.id = `ITEM-${_item['$loki']}`
                        item.work.set(work)
                        item.name = _item.name
                        item.body = _item.description
                        item.status = statusMap[_item.status as keyof typeof statusMap]
                        item.createdAt = DateTime.fromMillis(_item.meta.created).toJSDate()
                        item.updatedAt = DateTime.fromMillis(
                            _item.meta.updated || _item.meta.created
                        ).toJSDate()
                    })
                })
            }
        }

        // locations
        if (data.collections[7].data.length) {
            for await (const _location of data.collections[7].data) {
                await database.write(async () => {
                    return await database.get<LocationModel>('location').create((location) => {
                        location._raw.id = `LOCATION-${_location['$loki']}`
                        location.work.set(work)
                        location.name = _location.location
                        location.body = _location.description
                        location.status = statusMap[_location.status as keyof typeof statusMap]
                        location.createdAt = DateTime.fromMillis(_location.meta.created).toJSDate()
                        location.updatedAt = DateTime.fromMillis(
                            _location.meta.updated || _location.meta.created
                        ).toJSDate()
                    })
                })
            }
        }

        // characters

        if (data.collections[5].data.length) {
            for await (const _character of data.collections[5].data) {
                await database.write(async () => {
                    return await database.get<CharacterModel>('character').create((character) => {
                        character._raw.id = `CHARACTER-PRIM-${_character['$loki']}`
                        character.work.set(work)
                        character.mode = CharacterMode.PRIMARY
                        character.displayName = _character.name
                        character.firstName = _character.personaldata.questions[0].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.lastName = _character.personaldata.questions[1].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.nickname = _character.personaldata.questions[2].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.gender = _character.personaldata.questions[3].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.apparentAge = !isNaN(
                            _character.personaldata.questions[4].text.replace(/<[^>]*>/g, '')
                        )
                            ? _character.personaldata.questions[4].text.replace(/<[^>]*>/g, '')
                            : ''
                        character.placeOfBirth = _character.personaldata.questions[5].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.residence = _character.personaldata.questions[6].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.education = _character.personaldata.questions[7].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.profession = _character.personaldata.questions[8].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.finances = _character.personaldata.questions[9].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.ethnicity = _character.physionomy.questions[0].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.height = _character.physionomy.questions[1].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.build = _character.physionomy.questions[2].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.hair = _character.physionomy.questions[3].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.face = `${_character.physionomy.questions[4].text.replace(
                            /<[^>]*>/g,
                            ''
                        )}
                        ${_character.physionomy.questions[5].text.replace(/<[^>]*>/g, '')}
                        ${_character.physionomy.questions[6].text.replace(/<[^>]*>/g, '')}`
                        // eslint-disable-next-line max-len
                        character.distinguishingFeatures = `${_character.physionomy.questions[22].text.replace(
                            /<[^>]*>/g,
                            ''
                        )}
                        ${_character.physionomy.questions[23].text.replace(/<[^>]*>/g, '')}`
                        character.religion = _character.ideas.questions[0].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.politicalLeaning = _character.ideas.questions[2].text.replace(
                            /<[^>]*>/g,
                            ''
                        )
                        character.description = _character.description
                        character.history = _character.lifebeforestorybeginning
                        character.status = statusMap[_character.status as keyof typeof statusMap]
                        character.createdAt = DateTime.fromMillis(
                            _character.meta.created
                        ).toJSDate()
                        character.updatedAt = DateTime.fromMillis(
                            _character.meta.updated || _character.meta.created
                        ).toJSDate()
                    })
                })
            }
        }

        if (data.collections[6].data.length) {
            for await (const _character of data.collections[6].data) {
                await database.write(async () => {
                    return await database.get<CharacterModel>('character').create((character) => {
                        character._raw.id = `CHARACTER-SEC-${_character['$loki']}`
                        character.work.set(work)
                        character.mode = CharacterMode.SECONDARY
                        character.displayName = _character.name
                        character.description = _character.description
                        character.status = statusMap[_character.status as keyof typeof statusMap]
                        character.createdAt = DateTime.fromMillis(
                            _character.meta.created
                        ).toJSDate()
                        character.updatedAt = DateTime.fromMillis(
                            _character.meta.updated || _character.meta.created
                        ).toJSDate()
                    })
                })
            }
        }
    }

    return (
        <Box>
            <Typography variant='h4'>{t('view.storyline.importWork.title')}</Typography>
            <Button onClick={importBibisco}>{t('view.storyline.importWork.bibisco')}</Button>
        </Box>
    )
}

export default ImportWorkView
