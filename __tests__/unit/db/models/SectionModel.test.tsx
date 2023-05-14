import { DateTime } from 'luxon'
import database from '@sl/db'
import { SectionMode } from '@sl/constants/sectionMode'
import { SectionModel, WorkModel } from '@sl/db/models'

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
        const section = await work.addPart()
        const character = await work.addCharacter('PRIMARY', {
            displayName: 'Test'
        })
        const item = await work.addItem({ name: 'Item' })
        const location = await work.addLocation({ name: 'Location' })
        const note = await work.addNote({ title: 'Note' })

        await section.updateRecord(
            {},
            {
                characters: [character],
                items: [item],
                locations: [location],
                notes: [note]
            }
        )

        const characterTagCount = await section.characterTags.fetchCount()
        expect(characterTagCount).toEqual(1)

        const itemTagCount = await section.itemTags.fetchCount()
        expect(itemTagCount).toEqual(1)

        const locationTagCount = await section.locationTags.fetchCount()
        expect(locationTagCount).toEqual(1)

        const noteTagCount = await section.noteTags.fetchCount()
        expect(noteTagCount).toEqual(1)
    })

    it('updates the PoV Character', async () => {
        const character = await work.addCharacter('PRIMARY', {
            displayName: 'Character'
        })
        await aSection.updatePoVCharacter(character)
        expect(aSection.pointOfViewCharacter.id).toBe(character.id)
    })

    it('adds a statistic', async () => {
        await aSection.addStatistic(100)
        const statistics = await aSection.statistic.fetchCount()
        expect(statistics).toBe(1)
    })

    test('excerpts returns all excerpt text in body', async () => {
        await aSection.updateBody('')
        expect(aSection.excerpts).toBeNull()

        await aSection.updateBody('<p>not an excerpt</p>')
        render(<div>{aSection.excerpts}</div>)
        expect(screen.queryByText('not an excerpt')).toBeFalsy()

        await aSection.updateBody('<blockquote>an excerpt</blockquote>')
        render(<div>{aSection.excerpts}</div>)
        expect(screen.getByText('an excerpt')).toBeTruthy()
    })

    test('word count returns as expected', async () => {
        const part = await work.addPart()
        const chapter1 = await part.addChapter()
        const chapter2 = await part.addChapter()
        const scene1 = await chapter1.addScene()
        const scene2 = await chapter1.addScene()
        const scene3 = await chapter2.addScene()
        await scene1.updateBody('<p>This is a word count test</p>')
        await scene2.updateBody('<p>This is a word count test</p>')
        await scene3.updateBody('<p>This is a word count test</p>')

        const partCount = await part.getWordCount()
        expect(partCount).toEqual(18)

        const chapter1Count = await chapter1.getWordCount()
        expect(chapter1Count).toEqual(12)

        const chapter2Count = await chapter2.getWordCount()
        expect(chapter2Count).toEqual(6)

        const scene1Count = await scene1.getWordCount()
        expect(scene1Count).toEqual(6)

        const scene2Count = await scene2.getWordCount()
        expect(scene2Count).toEqual(6)
    })

    test('updateRecord with tags updates record and tags', async () => {
        const section = await work.addPart()
        const character = await work.addCharacter('PRIMARY', {
            displayName: 'Test'
        })
        const item = await work.addItem({ name: 'Item' })
        const location = await work.addLocation({ name: 'Location' })
        const note = await work.addNote({ title: 'Note' })

        await section.updateRecord(
            { title: 'Test' },
            {
                characters: [character],
                items: [item],
                locations: [location],
                notes: [note]
            }
        )
        expect(section.title).toBe('Test')
        const countTags = await section.tag.fetchCount()
        expect(countTags).toBe(4)
    })

    test('daysRemining is null if no given deadlineAt', async () => {
        expect(aSection.daysRemaining).toBeNull()
    })

    test('daysRemining gives days if the deadlineAt date is in the future', async () => {
        const days = 7
        const now = DateTime.now()
        const deadline = now.plus({ days })

        await aSection.updateRecord({ deadlineAt: deadline.toJSDate() })

        expect(aSection.daysRemaining).toBe(7)
    })

    test('daysRemining gives returns 0 if the deadlineAt date is in the past', async () => {
        const days = 7
        const now = DateTime.now()
        const deadline = now.minus({ days })

        await aSection.updateRecord({ deadlineAt: deadline.toJSDate() })

        expect(aSection.daysRemaining).toBe(0)
    })

    test('daysRemining gives returns 0 if the deadlineAt date is today', async () => {
        await aSection.updateRecord({ deadlineAt: DateTime.now().toJSDate() })

        expect(aSection.daysRemaining).toBe(0)
    })

    it('calculates words per day if they exist', async () => {
        await aSection.updateRecord({ deadlineAt: null })
        expect(aSection.wordsPerDay).toBeNull()

        await aSection.updateRecord({ wordGoal: 1000 })
        expect(aSection.wordsPerDay).toBeNull()

        await aSection.updateRecord({ deadlineAt: DateTime.now().toJSDate() })
        await aSection.updateBody('<p>This is some text</p>')
        const wordCount = await aSection.getWordCount()
        expect(aSection.wordsPerDay).toBe(1000 - wordCount)

        await aSection.updateRecord({ deadlineAt: DateTime.now().plus({ days: 7 }).toJSDate() })
        expect(aSection.wordsPerDay).toBe(143)
    })

    it('checks if a given id has been tagged in a scene', async () => {
        const isTagged = await aSection.isTagged('abc')
        expect(isTagged).toBeFalsy()
    })

    test('taggedCharacters returns all tagged characters', async () => {
        const tagged = await aSection.taggedCharacters()
        expect(tagged.length).toBe(0)
    })

    test('taggedItems returns all tagged items', async () => {
        const tagged = await aSection.taggedItems()
        expect(tagged.length).toBe(0)
    })

    test('taggedLocations returns all tagged locations', async () => {
        const tagged = await aSection.taggedLocations()
        expect(tagged.length).toBe(0)
    })

    test('taggedNotes returns all tagged notes', async () => {
        const tagged = await aSection.taggedNotes()
        expect(tagged.length).toBe(0)
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
