import database from '@sl/db'
import { CharacterModel, ConnectionModel, WorkModel } from '@sl/db/models'

describe('ConnectionModel', () => {
    let work: WorkModel
    let aConnection: ConnectionModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const characterA = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'A Character'
                character.mode = 'SECONDARY'
            })
        })

        const characterB = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'B Character'
                character.mode = 'SECONDARY'
            })
        })

        aConnection = await work.addConnection({
            mode: 'Siblings',
            tableA: 'character',
            tableB: 'character',
            idA: characterA.id,
            idB: characterB.id,
            to: true,
            from: true,
            date: '2001-01-01 08:00:00',
            color: '#CCCCCC'
        })
    })

    it('sortDate should return the date in milliseconds', async () => {
        expect(aConnection.sortDate).toEqual(978336000)
    })

    it('displayDate should return the given date', async () => {
        expect(aConnection.displayDate).toEqual('Monday 01 Jan 2001')
    })

    it('displayTime should return the given date', async () => {
        expect(aConnection.displayTime).toEqual('8:00')
    })

    it('displayDateTime should return the given datetime', async () => {
        expect(aConnection.displayDateTime).toEqual('Monday 01 Jan 2001 8:00')
    })

    it('displayName should display both idA and idB displaNames', async () => {
        const displayName = await aConnection.displayName()
        expect(displayName).toEqual('A Character Siblings B Character')
    })

    it('updateRecord should save new data', async () => {
        const color = '#FF0000'
        await aConnection.updateRecord({ color })
        expect(aConnection.color).toEqual(color)
    })

    it('deletes connection', async () => {
        const countA = await database.get<ConnectionModel>('connection').query().fetchCount()
        await aConnection.delete()
        const countB = await database.get<ConnectionModel>('connection').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })
})
