import { DateTime } from 'luxon'
import database from '@sl/db'
import { WorkModel } from '@sl/db/models'

describe('WorkModel', () => {
    let aWork: WorkModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        aWork = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
                work.deadlineAt = DateTime.fromSQL('2001-01-01 08:00:00').toJSDate()
            })
        })
    })

    test('displayDeadline should return the given datetime', () => {
        expect(aWork.displayDeadline).toEqual('Monday 01 Jan 2001 8:00')
    })

    test('updateRecord updates data', async () => {
        await aWork.updateRecord({ title: 'A new title' })
        expect(aWork.title).toEqual('A new title')
    })

    test('restore', async () => {
        await aWork.restore({
            work: [
                {
                    id: 'work',
                    title: 'A restored title',
                    deadline_at: 0,
                    created_at: 0,
                    updated_at: 0
                }
            ],
            character: [
                {
                    id: 'character',
                    mode: 'PRIMARY',
                    created_at: 0,
                    updated_at: 0
                }
            ],
            connection: [
                {
                    id: 'connection',
                    created_at: 0,
                    updated_at: 0
                }
            ],
            item: [
                {
                    id: 'item',
                    created_at: 0,
                    updated_at: 0
                }
            ],
            location: [
                {
                    id: 'location',
                    created_at: 0,
                    updated_at: 0
                },
                {
                    id: 'location2',
                    location_id: 'location',
                    created_at: 0,
                    updated_at: 0
                }
            ],
            note: [
                {
                    id: 'note',
                    created_at: 0,
                    updated_at: 0
                },
                {
                    id: 'note2',
                    note_id: 'note',
                    is_taggable: 1,
                    created_at: 0,
                    updated_at: 0
                }
            ],
            section: [
                {
                    id: 'section',
                    mode: 'PART',
                    created_at: 0,
                    updated_at: 0,
                    deadline_at: 0
                },
                {
                    id: 'section2',
                    mode: 'CHAPTER',
                    section_id: 'section',
                    point_of_view_character_id: 'character',
                    created_at: 0,
                    updated_at: 0,
                    deadline_at: 1
                },
                {
                    id: 'section3',
                    mode: 'SCENE',
                    section_id: 'section2',
                    created_at: 0,
                    updated_at: 0,
                    deadline_at: 0
                }
            ],
            statistic: [
                {
                    id: 'statistic',
                    created_at: 0,
                    updated_at: 0
                }
            ],
            tag: [
                {
                    id: 'tag',
                    character_id: 'character',
                    created_at: 0,
                    updated_at: 0
                }
            ]
        })
        expect(aWork.title).toEqual('A restored title')
    })

    it('fetches notes', async () => {
        const notes = await aWork.notes.fetchCount()
        expect(notes).toEqual(2)
    })

    it('fetches characters', async () => {
        const notes = await aWork.characters.fetchCount()
        expect(notes).toEqual(1)
    })

    it('fetches items', async () => {
        const notes = await aWork.items.fetchCount()
        expect(notes).toEqual(1)
    })

    it('fetches locations', async () => {
        const locations = await aWork.locations.fetchCount()
        expect(locations).toEqual(2)
    })

    it('fetches taggableNotes', async () => {
        const notes = await aWork.taggableNotes.fetchCount()
        expect(notes).toEqual(1)
    })

    it('fetches characters', async () => {
        const characters = await aWork.characters.fetchCount()
        expect(characters).toEqual(1)
    })

    it('fetches primaryCharacters', async () => {
        const characters = await aWork.primaryCharacters.fetchCount()
        expect(characters).toEqual(1)
    })

    it('fetches secondaryCharacters', async () => {
        const characters = await aWork.secondaryCharacters.fetchCount()
        expect(characters).toEqual(0)
    })

    it('fetches tertiaryCharacters', async () => {
        const characters = await aWork.tertiaryCharacters.fetchCount()
        expect(characters).toEqual(0)
    })

    it('fetches tags', async () => {
        const tags = await aWork.tags.fetchCount()
        expect(tags).toEqual(0)
    })

    it('fetches statistics', async () => {
        const stats = await aWork.statistics.fetchCount()
        expect(stats).toEqual(0)
    })

    it('fetches sections', async () => {
        const sections = await aWork.sections.fetchCount()
        expect(sections).toEqual(3)
    })

    it('fetches parts', async () => {
        const parts = await aWork.parts.fetchCount()
        expect(parts).toEqual(1)
    })

    it('fetches chapters', async () => {
        const chapters = await aWork.chapters.fetchCount()
        expect(chapters).toEqual(1)
    })

    it('fetches scenes', async () => {
        const scenes = await aWork.scenes.fetchCount()
        expect(scenes).toEqual(1)
    })

    test('backups', async () => {
        const backup = await aWork.backup()
        expect(backup.data.work[0].title).toBe('A restored title')
        expect(backup.data.character.length).toBe(1)
        expect(backup.data.connection.length).toBe(1)
        expect(backup.data.item.length).toBe(1)
        expect(backup.data.location.length).toBe(2)
        expect(backup.data.note.length).toBe(2)
        expect(backup.data.section.length).toBe(3)
        expect(backup.data.statistic.length).toBe(1)
        expect(backup.data.tag.length).toBe(1)
    })

    test('delete() deletes work', async () => {
        const countA = await database.get<WorkModel>('work').query().fetchCount()
        await aWork.delete()
        const countB = await database.get<WorkModel>('work').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })
})
