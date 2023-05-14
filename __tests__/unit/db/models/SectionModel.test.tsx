import database from '@sl/db'
import { SectionMode } from '@sl/constants/sectionMode'
import { CharacterModel, SectionModel, WorkModel } from '@sl/db/models'

import { render, screen } from '../../test-utils'

describe('SectionModel', () => {
    let work: WorkModel
    let aSection: SectionModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        aSection = await database.write(async () => {
            return database.get<SectionModel>('section').create((section) => {
                section.work.set(work)
                section.mode = SectionMode.CHAPTER
                section.order = 1
                section.date = '2001-01-01 08:00:00'
            })
        })
    })

    test('displayTitle shows title if given and generates one from mode and order if not', async () => {
        expect(aSection.displayTitle).toEqual('Chapter 1')

        await aSection.updateRecord({ mode: SectionMode.VERSION })
        expect(aSection.displayTitle).toEqual(`Version ${aSection.order}`)

        await aSection.updateRecord({ mode: SectionMode.SCENE })
        expect(aSection.displayTitle).toEqual('Scene 1')

        await aSection.updateRecord({ mode: SectionMode.PART })
        expect(aSection.displayTitle).toEqual('Part 1')

        await aSection.updateRecord({ title: 'A Section Title' })
        expect(aSection.displayTitle).toEqual('A Section Title')

        await aSection.updateRecord({ mode: SectionMode.VERSION, title: 'A Section Title' })
        expect(aSection.displayTitle).toEqual('A Section Title (1)')
    })

    test('displayName returns displayTitle', async () => {
        expect(aSection.displayName).toEqual(aSection.displayTitle)
    })

    test('displayBody returns expected html', async () => {
        await aSection.updateRecord({ mode: SectionMode.SCENE })

        const bodyText = 'This is the body of a scene'

        render(
            <div>
                <p>{aSection.displayBody}</p>
            </div>
        )
        expect(screen.queryByText(bodyText)).toBeFalsy()

        await aSection.updateBody(bodyText)

        render(
            <div>
                <p>{aSection.displayBody}</p>
            </div>
        )
        expect(screen.getByText(bodyText)).toBeTruthy()
    })

    test('displayDescription returns expected html', async () => {
        const descriptionText = 'This is the description of a scene'

        render(
            <div>
                <p>{aSection.displayDescription}</p>
            </div>
        )
        expect(screen.queryByText(descriptionText)).toBeFalsy()

        await aSection.updateRecord(
            { description: descriptionText },
            { characters: [], items: [], locations: [], notes: [] }
        )

        render(
            <div>
                <p>{aSection.displayDescription}</p>
            </div>
        )
        expect(screen.getByText(descriptionText)).toBeTruthy()
    })

    test('sortDate should return the date in milliseconds', async () => {
        expect(aSection.sortDate).toEqual(978336000)
    })

    test('displayDate should return the given date', async () => {
        expect(aSection.displayDate).toEqual('Monday 01 Jan 2001')
    })

    test('displayTime should return the given date', async () => {
        expect(aSection.displayTime).toEqual('8:00')
    })

    test('displayDateTime should return the given datetime', async () => {
        expect(aSection.displayDateTime).toEqual('Monday 01 Jan 2001 8:00')
    })

    test('isChapter returns true if mode is chapter and false otherwise', async () => {
        await aSection.updateRecord({ mode: SectionMode.CHAPTER })
        expect(aSection.isChapter).toBeTruthy()
        expect(aSection.isScene).toBeFalsy()
        expect(aSection.isPart).toBeFalsy()
        expect(aSection.isVersion).toBeFalsy()
    })

    test('isScene returns true if mode is scene and false otherwise', async () => {
        await aSection.updateRecord({ mode: SectionMode.SCENE })
        expect(aSection.isChapter).toBeFalsy()
        expect(aSection.isScene).toBeTruthy()
        expect(aSection.isPart).toBeFalsy()
        expect(aSection.isVersion).toBeFalsy()
    })

    test('isPart returns true if mode is part and false otherwise', async () => {
        await aSection.updateRecord({ mode: SectionMode.PART })
        expect(aSection.isChapter).toBeFalsy()
        expect(aSection.isScene).toBeFalsy()
        expect(aSection.isPart).toBeTruthy()
        expect(aSection.isVersion).toBeFalsy()
    })

    test('isVersion returns true if mode is version and false otherwise', async () => {
        await aSection.updateRecord({ mode: SectionMode.VERSION })
        expect(aSection.isChapter).toBeFalsy()
        expect(aSection.isScene).toBeFalsy()
        expect(aSection.isPart).toBeFalsy()
        expect(aSection.isVersion).toBeTruthy()
    })

    test('fetches notes', async () => {
        const notes = await aSection.notes.fetchCount()
        expect(notes).toEqual(0)
    })

    test('fetches sections', async () => {
        await aSection.updateRecord({ mode: SectionMode.PART })
        const chapter = await aSection.addChapter()
        const scene = await chapter.addScene()
        await scene.addVersion()

        const chapterCount = await aSection.chapters.fetchCount()
        expect(chapterCount).toEqual(1)

        const sceneCount = await chapter.scenes.fetchCount()
        expect(sceneCount).toEqual(1)

        const versionCount = await scene.versions.fetchCount()
        expect(versionCount).toEqual(1)
    })

    test('fetches statistics', async () => {
        const statsCount = await aSection.statistics.fetchCount()
        expect(statsCount).toEqual(0)
    })

    test('fetches tags', async () => {
        const characterTagCount = await aSection.characterTags.fetchCount()
        expect(characterTagCount).toEqual(0)

        const itemTagCount = await aSection.itemTags.fetchCount()
        expect(itemTagCount).toEqual(0)

        const locationTagCount = await aSection.locationTags.fetchCount()
        expect(locationTagCount).toEqual(0)

        const noteTagCount = await aSection.noteTags.fetchCount()
        expect(noteTagCount).toEqual(0)
    })

    it('updates the PoV Character', async () => {
        const character = await work.addCharacter('PRIMARY', {
            displayName: 'Character'
        })
        await aSection.updatePoVCharacter(character)
        expect(aSection.pointOfViewCharacter.id).toBe(character.id)
    })

    it('deletes if no children', async () => {
        const part = await work.addPart()
        const chapter = await part.addChapter()
        const scene = await chapter.addScene()

        const countA = await database.get<SectionModel>('section').query().fetchCount()
        await part.delete()
        const countB = await database.get<SectionModel>('section').query().fetchCount()
        expect(countB).toEqual(countA)

        await chapter.delete()
        const countC = await database.get<SectionModel>('section').query().fetchCount()
        expect(countC).toEqual(countB)

        await scene.delete()
        const countD = await database.get<SectionModel>('section').query().fetchCount()
        expect(countD).toEqual(countC - 1)

        await chapter.delete()
        const countE = await database.get<SectionModel>('section').query().fetchCount()
        expect(countE).toEqual(countD - 1)

        await part.delete()
        const countF = await database.get<SectionModel>('section').query().fetchCount()
        expect(countF).toEqual(countE - 1)
    })
})
