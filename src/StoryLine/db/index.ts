import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

import schema from './schema'
// import migrations from './migrations'

import {
    CharacterModel,
    ConnectionModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    SprintModel,
    SprintStatisticModel,
    StatisticModel,
    TagModel,
    WorkModel
} from './models'

const adapter = new LokiJSAdapter({
    schema,
    // migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    dbName: process.env.DB_NAME || crypto.randomUUID()
})

const database = new Database({
    adapter,
    modelClasses: [
        CharacterModel,
        ConnectionModel,
        ItemModel,
        LocationModel,
        NoteModel,
        SectionModel,
        SprintModel,
        SprintStatisticModel,
        StatisticModel,
        TagModel,
        WorkModel
    ]
})

export default database
