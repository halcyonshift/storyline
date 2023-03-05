import database from '../../../../src/StoryLine/db'
import CharacterModel from '../../../../src/StoryLine/db/models/CharacterModel'
import WorkModel from '../../../../src/StoryLine/db/models/WorkModel'

describe('CharacterModel', () => {
    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    it('has character table', async () => {
        expect(CharacterModel.table).toBe('character')
    })

    it('isPrimary should be true for main characters and false for secondary characters', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const character = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'Main Character'
                character.mode = 'primary'
            })
        })

        expect(character.isPrimary).toBeTruthy()
        expect(character.isSecondary).toBeFalsy()
    })

    it('isPrimary should be false for secondary characters and true for secondary characters', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const character = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'Secondary Character'
                character.mode = 'secondary'
            })
        })

        expect(character.isPrimary).toBeFalsy()
        expect(character.isSecondary).toBeTruthy()
    })
})
