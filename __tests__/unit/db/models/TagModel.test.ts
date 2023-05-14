import database from '@sl/db'
import { TagModel, WorkModel } from '@sl/db/models'

describe('TagModel', () => {
    let work: WorkModel
    let aTag: TagModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const section = await work.addPart()

        aTag = await database.write(async () => {
            return database.get<TagModel>('tag').create((tag) => {
                tag.work.set(work)
                tag.section.set(section)
            })
        })
    })

    it('deletes tag', async () => {
        const countA = await database.get<TagModel>('tag').query().fetchCount()
        await aTag.delete()
        const countB = await database.get<TagModel>('tag').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })
})
