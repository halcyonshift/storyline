import { DateTime } from 'luxon'
import database from '@sl/db'
import { StatisticModel, WorkModel } from '@sl/db/models'

describe('StatisticModel', () => {
    let work: WorkModel
    let aStatistic: StatisticModel

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

        aStatistic = await database.write(async () => {
            return database.get<StatisticModel>('statistic').create((statistic) => {
                statistic.work.set(work)
                statistic.section.set(section)
            })
        })
    })

    it('knows if it was created today', async () => {
        expect(aStatistic.isToday).toBeTruthy()
        await database.write(async () => {
            await aStatistic.update(() => {
                aStatistic.createdAt = DateTime.now().minus({ days: 7 }).toJSDate()
            })
        })
        expect(aStatistic.isToday).toBeFalsy()
    })

    it('updates word count', async () => {
        expect(aStatistic.words).toEqual(null)
        await aStatistic.updateWords(100)
        expect(aStatistic.words).toEqual(100)
    })

    it('deletes statistic', async () => {
        const countA = await database.get<StatisticModel>('statistic').query().fetchCount()
        await aStatistic.delete()
        const countB = await database.get<StatisticModel>('statistic').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })
})
