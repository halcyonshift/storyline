/** @format */

import database from '../../../../src/StoryLine/db'
import LocationModel from '../../../../src/StoryLine/db/models/LocationModel'
import WorkModel from '../../../../src/StoryLine/db/models/WorkModel'

describe('LocationModel', () => {
    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })
    })

    it('has item table', async () => {
        expect(LocationModel.table).toBe('location')
    })

    it('displayName should return the location name', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const locationName = 'A location'

        const location = await database.write(async () => {
            return database.get<LocationModel>('location').create((location) => {
                location.work.set(work)
                location.name = locationName
            })
        })

        expect(location.displayName).toEqual(locationName)
    })

    it('child location should have location has parent', async () => {
        const work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        const parentLocation = await database.write(async () => {
            return database.get<LocationModel>('location').create((location) => {
                location.work.set(work)
                location.name = 'Parent'
            })
        })

        const childName = 'Child'

        const childLocation = await parentLocation.addLocation({
            name: childName
        })

        expect(childLocation.displayName).toEqual(childName)
    })
})
