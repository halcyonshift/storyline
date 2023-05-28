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
    StyleModel,
    TagModel,
    WorkModel
} from './models'

const adapter = new LokiJSAdapter({
    schema,
    // migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    dbName: process.env.DB_NAME_RANDOM ? crypto.randomUUID() : process.env.DB_NAME
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
        StyleModel,
        TagModel,
        WorkModel
    ]
})

export default database
