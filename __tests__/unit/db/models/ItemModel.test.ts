import database from '../../../../src/StoryLine/db'
import ItemModel from '../../../../src/StoryLine/db/models/ItemModel'
import WorkModel from '../../../../src/StoryLine/db/models/WorkModel'

describe('ItemModel', () => {
    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    it('has item table', async () => {
        expect(ItemModel.table).toBe('item')
    })

    it('displayName should return the item name', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const itemName = 'An item'

        const item = await database.write(async () => {
            return database.get<ItemModel>('item').create((item) => {
                item.work.set(work)
                item.name = itemName
            })
        })

        expect(item.displayName).toEqual(itemName)
    })
})
