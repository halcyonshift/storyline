import database from '@sl/db'
import { LocationModel, WorkModel } from '@sl/db/models'

describe('LocationModel', () => {
    let work: WorkModel
    let aLocation: LocationModel

    beforeAll(async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase()
        })

        work = await database.write(async () => {
            return database.get<WorkModel>('work').create((work) => {
                work.title = 'Test'
            })
        })

        aLocation = await database.write(async () => {
            return database.get<LocationModel>('location').create((location) => {
                location.work.set(work)
                location.name = 'A location'
            })
        })
    })

    test('displayName should return the location name', () => {
        expect(aLocation.displayName).toEqual(aLocation.name)
    })

    test('child location should have location as parent', async () => {
        const childName = 'Child'

        const childLocation = await aLocation.addLocation({
            name: childName
        })

        expect(childLocation.displayName).toEqual(childName)
        expect(childLocation.location.id).toEqual(aLocation.id)
    })

    test('latLng should return null if either latitude and longitude not set', async () => {
        expect(aLocation.latLng).toBeNull()
        await aLocation.updateRecord({
            latitude: '51.50716224190307'
        })
        expect(aLocation.latLng).toBeNull()
        await aLocation.updateRecord({
            latitude: '',
            longitude: '-0.11808832931164506'
        })
        expect(aLocation.latLng).toBeNull()
    })

    test('latLng should return array if both latitude and longitude set', async () => {
        await aLocation.updateRecord({
            latitude: '51.50716224190307',
            longitude: '-0.11808832931164506'
        })
        expect(aLocation.latLng).toEqual([
            parseFloat('51.50716224190307'),
            parseFloat('-0.11808832931164506')
        ])
    })

    it('fetches notes', async () => {
        const notes = await aLocation.notes.fetchCount()
        expect(notes).toEqual(0)
    })

    it('does not delete location if children', async () => {
        const countA = await database.get<LocationModel>('location').query().fetchCount()
        await aLocation.delete()
        const countB = await database.get<LocationModel>('location').query().fetchCount()
        expect(countB).toEqual(countA)
    })

    it('deletes location if no children', async () => {
        const children = await aLocation.locations.fetch()
        const countA = await database.get<LocationModel>('location').query().fetchCount()
        await children[0].delete()
        const countB = await database.get<LocationModel>('location').query().fetchCount()
        expect(countB).toEqual(countA - 1)
    })
})
