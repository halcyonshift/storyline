import database from '@sl/db'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'

describe('NoteModel', () => {
    let work: WorkModel
    let aNote: NoteModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        aNote = await database.write(async () => {
            return database.get<NoteModel>('note').create((note) => {
                note.work.set(work)
                note.title = 'A note'
                note.date = '2001-01-01 08:00:00'
            })
        })
    })

    it('displayName should return the note title', async () => {
        expect(aNote.displayName).toEqual(aNote.title)
    })

    it('sortDate should return the date in milliseconds', async () => {
        expect(aNote.sortDate).toEqual(978336000)
    })

    it('displayDate should return the given date', async () => {
        expect(aNote.displayDate).toEqual('Monday 01 Jan 2001')
    })

    it('displayTime should return the given date', async () => {
        expect(aNote.displayTime).toEqual('8:00')
    })

    it('displayDateTime should return the given datetime', async () => {
        expect(aNote.displayDateTime).toEqual('Monday 01 Jan 2001 8:00')
    })

    it('fetches notes', async () => {
        const notes = await aNote.notes.fetchCount()
        expect(notes).toEqual(0)
    })

    test('child note should have note as parent', async () => {
        const title = 'Child'
        const childNote = await aNote.addNote({ title })

        expect(childNote.displayName).toEqual(title)
        expect(childNote.note.id).toEqual(aNote.id)
    })

    it('saves new data with updateRecord', async () => {
        const title = 'A note again'
        await aNote.updateRecord({ title })
        expect(aNote.title).toEqual(title)
    })

    it('does not delete note if children', async () => {
        const countA = await database.get<NoteModel>('note').query().fetchCount()
        await aNote.delete()
        const countB = await database.get<NoteModel>('note').query().fetchCount()
        expect(countB).toEqual(countA)
    })

    it('deletes note if no children', async () => {
        const children = await aNote.notes.fetch()
        const countA = await database.get<NoteModel>('note').query().fetchCount()
        await children[0].delete()
        const countB = await database.get<NoteModel>('note').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })

    it('sets correct association', async () => {
        const character = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'Character'
                character.mode = 'PRIMARY'
            })
        })

        await aNote.updateAssociation(character)
        expect(aNote.character.id).toEqual(character.id)

        const item = await database.write(async () => {
            return database.get<ItemModel>('item').create((item) => {
                item.work.set(work)
                item.name = 'An item'
            })
        })

        await aNote.updateAssociation(item)
        expect(aNote.item.id).toEqual(item.id)

        const location = await database.write(async () => {
            return database.get<LocationModel>('location').create((location) => {
                location.work.set(work)
                location.name = 'A location'
            })
        })

        await aNote.updateAssociation(location)
        expect(aNote.location.id).toEqual(location.id)

        await aNote.updateAssociation(aNote)
        expect(aNote.note.id).toEqual('')

        const note = await database.write(async () => {
            return database.get<NoteModel>('note').create((note) => {
                note.work.set(work)
                note.title = 'Another note'
            })
        })

        await aNote.updateAssociation(note)
        expect(aNote.note.id).toEqual(note.id)

        const section = await database.write(async () => {
            return database.get<SectionModel>('section').create((section) => {
                section.work.set(work)
                section.title = 'A section'
                section.mode = 'PART'
            })
        })

        await aNote.updateAssociation(section)
        expect(aNote.section.id).toEqual(section.id)
    })
})
