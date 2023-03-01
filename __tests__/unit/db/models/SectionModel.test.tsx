/** @format */

import database from '../../../../src/StoryLine/db'
import WorkModel from '../../../../src/StoryLine/db/models/WorkModel'
import SectionModel from '../../../../src/StoryLine/db/models/SectionModel'

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
                section.mode = 'chapter'
                section.order = 1
            })
        })

        expect(section.displayTitle).toEqual('Chapter 1')

        await database.write(async () => {
            await section.update((section) => {
                section.mode = 'revision'
            })
        })

        expect(section.displayTitle).toEqual(section.id)

        await database.write(async () => {
            await section.update((section) => {
                section.mode = 'scene'
            })
        })

        expect(section.displayTitle).toEqual('Scene 1')

        await database.write(async () => {
            await section.update((section) => {
                section.mode = 'part'
            })
        })

        expect(section.displayTitle).toEqual('Part 1')

        const sectionTitle = 'Section Title'
        await section.updateTitle(sectionTitle)

        expect(section.displayTitle).toEqual(sectionTitle)
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
                section.mode = 'scene'
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
                section.mode = 'scene'
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

        await section.updateDescription(descriptionText)

        render(
            <div>
                <p>{section.displayDescription}</p>
            </div>
        )
        expect(screen.getByText(descriptionText)).toBeTruthy()
    })
})
