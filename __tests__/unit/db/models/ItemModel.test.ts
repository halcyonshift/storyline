import database from '@sl/db'
import { ItemModel, WorkModel } from '@sl/db/models'

describe('ItemModel', () => {
    let work: WorkModel
    let anItem: ItemModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        anItem = await database.write(async () => {
            return database.get<ItemModel>('item').create((item) => {
                item.work.set(work)
                item.name = 'An item'
            })
        })
    })

    it('displayName should return the item name', () => {
        expect(anItem.displayName).toEqual(anItem.name)
    })

    it('fetches notes', async () => {
        const notes = await anItem.notes.fetchCount()
        expect(notes).toEqual(0)
    })

    it('saves new data with updateRecord', async () => {
        const name = 'An item again'
        await anItem.updateRecord({ name })
        expect(anItem.name).toEqual(name)
    })

    it('deletes item', async () => {
        const countA = await database.get<ItemModel>('item').query().fetchCount()
        await anItem.delete()
        const countB = await database.get<ItemModel>('item').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })
})
