/** @format */

import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

import schema from './schema'
// import migrations from './migrations'

import {
    AnnotationModel,
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    ProjectModel,
    SectionModel,
    StatisticModel
} from './models'

const adapter = new LokiJSAdapter({
    schema,
    // migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    dbName: 'storyline',
    onQuotaExceededError: (error) => {
        console.log(error)
        // ToDo - Error catch
        // Browser ran out of disk space -- offer the user to reload the app or log out
    },
    onSetUpError: (error) => {
        console.log(error)
        // ToDo - Error catch
        // Database failed to load -- offer the user to reload the app or log out
    },
    extraIncrementalIDBOptions: {
        onDidOverwrite: () => {
            // Called when this adapter is forced to overwrite contents of IndexedDB.
            // This happens if there's another open tab of the same app that's making changes.
            // Try to synchronize the app now, and if user is offline, alert them that if they
            // close this tab, some data may be lost
        },
        onversionchange: () => {
            // database was deleted in another browser tab (user logged out), so we must make sure
            // we delete it in this tab as well - usually best to just refresh the page
            // if (checkIfUserIsLoggedIn()) {
            //  window.location.reload()
            //}
        }
    }
})

// Then, make a Watermelon database from it!
const database = new Database({
    adapter,
    modelClasses: [
        AnnotationModel,
        CharacterModel,
        ItemModel,
        LocationModel,
        NoteModel,
        ProjectModel,
        SectionModel,
        StatisticModel
    ]
})

export default database
