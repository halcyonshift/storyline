import database from '@sl/db'
import WorkModel from '@sl/db/models/WorkModel'
import SectionModel from '@sl/db/models/SectionModel'

import { render, screen } from '../../test-utils'

describe('SectionModel', () => {
    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    it('has section table', async () => {
        expect(SectionModel.table).toBe('section')
    })

    test('displayTitle shows title if given and generates one from mode and order if not', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const section = await database.write(async () => {
            return database.get<SectionModel>('section').create((section) => {
                section.work.set(work)
                section.mode = 'CHAPTER'
                section.order = 1
            })
        })

        expect(section.displayTitle).toEqual('Chapter 1')

        await database.write(async () => {
            await section.update((section) => {
                section.mode = 'VERSION'
            })
        })

        expect(section.displayTitle).toEqual(`Version ${section.order}`)

        await database.write(async () => {
            await section.update((section) => {
                section.mode = 'SCENE'
            })
        })

        expect(section.displayTitle).toEqual('Scene 1')

        await database.write(async () => {
            await section.update((section) => {
                section.mode = 'PART'
            })
        })

        expect(section.displayTitle).toEqual('Part 1')
    })

    test('displayBody returns expected html', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const section = await database.write(async () => {
            return database.get<SectionModel>('section').create((section) => {
                section.work.set(work)
                section.mode = 'SCENE'
                section.order = 1
            })
        })

        const bodyText = 'This is the body of a scene'

        render(
            <div>
                <p>{section.displayBody}</p>
            </div>
        )
        expect(screen.queryByText(bodyText)).toBeFalsy()

        await section.updateBody(bodyText)

        render(
            <div>
                <p>{section.displayBody}</p>
            </div>
        )
        expect(screen.getByText(bodyText)).toBeTruthy()
    })

    test('displayDescription returns expected html', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const section = await database.write(async () => {
            return database.get<SectionModel>('section').create((section) => {
                section.work.set(work)
                section.mode = 'SCENE'
                section.order = 1
            })
        })

        const descriptionText = 'This is the description of a scene'

        render(
            <div>
                <p>{section.displayDescription}</p>
            </div>
        )
        expect(screen.queryByText(descriptionText)).toBeFalsy()

        await section.updateRecord(
            {
                title: section.title,
                description: descriptionText,
                date: section.date,
                wordGoal: section.wordGoal,
                deadlineAt: section.deadlineAt,
                pointOfView: section.pointOfView
            },
            { characters: [], items: [], locations: [], notes: [] }
        )

        render(
            <div>
                <p>{section.displayDescription}</p>
            </div>
        )
        expect(screen.getByText(descriptionText)).toBeTruthy()
    })
})
