import { CharacterMode } from '@sl/constants/characterMode'
import database from '@sl/db'
import CharacterModel from '@sl/db/models/CharacterModel'
import WorkModel from '@sl/db/models/WorkModel'

describe('CharacterModel', () => {
    let work: WorkModel
    let aCharacter: CharacterModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        aCharacter = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'Character'
                character.mode = CharacterMode.PRIMARY
            })
        })
    })

    it('isPrimary should be true for main characters and false for secondary characters and tertiary characters', () => {
        expect(aCharacter.isPrimary).toBeTruthy()
        expect(aCharacter.isSecondary).toBeFalsy()
        expect(aCharacter.isTertiary).toBeFalsy()
    })

    it('isSecondary should be true for secondary characters and false for primary and tertiary characters', async () => {
        const character = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'Secondary Character'
                character.mode = CharacterMode.SECONDARY
            })
        })

        expect(character.isPrimary).toBeFalsy()
        expect(character.isSecondary).toBeTruthy()
        expect(character.isTertiary).toBeFalsy()
    })

    it('isTertiary should be true for tertiary characters and false for primary and secondary characters', async () => {
        const character = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'Tertiary Character'
                character.mode = CharacterMode.TERTIARY
            })
        })

        expect(character.isPrimary).toBeFalsy()
        expect(character.isSecondary).toBeFalsy()
        expect(character.isTertiary).toBeTruthy()
    })

    it('displayDateOfBirth should return the given date of birth', async () => {
        const dateOfBirth = '2001-01-01'
        await aCharacter.updateRecord({ dateOfBirth })
        expect(aCharacter.displayDateOfBirth).toEqual('Monday 01 Jan 2001')
    })

    it('sortDate should return the dateOfBirth in milliseconds', async () => {
        const dateOfBirth = '2001-01-01'
        await aCharacter.updateRecord({ dateOfBirth })
        expect(aCharacter.sortDate).toEqual(978307200)
    })

    it('fetches notes', async () => {
        const notes = await aCharacter.notes.fetchCount()
        expect(notes).toEqual(0)
    })

    it('deletes character', async () => {
        const character = await database.write(async () => {
            return database.get<CharacterModel>('character').create((character) => {
                character.work.set(work)
                character.displayName = 'Character'
                character.mode = CharacterMode.PRIMARY
            })
        })
        const countA = await database.get<CharacterModel>('character').query().fetchCount()
        await character.delete()
        const countB = await database.get<CharacterModel>('character').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })
})
