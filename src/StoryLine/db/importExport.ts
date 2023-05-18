import { Database } from '@nozbe/watermelondb'
import IDBExportImport from 'indexeddb-export-import'

export const exportDb = (database: Database) => {
    const openDb: IDBOpenDBRequest = window.indexedDB.open(
        database.adapter.dbName,
        database.adapter.schema.version
    )
    openDb.onsuccess = (event: Event) => {
        const target = event.target as IDBOpenDBRequest
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        IDBExportImport.exportToJsonString(target.result, (e: Error, jsonString: string) => {
            //
        })
    }
}

export const importDb = (database: Database, jsonString: string) => {
    const openDb: IDBOpenDBRequest = window.indexedDB.open(
        database.adapter.dbName,
        database.adapter.schema.version
    )

    openDb.onsuccess = (event: Event) => {
        const target = event.target as IDBOpenDBRequest
        IDBExportImport.clearDatabase(target, (e: Error) => {
            if (!e) {
                IDBExportImport.importFromJsonString(target, jsonString, (e: Error) => {
                    return Boolean(e)
                })
            }
        })
    }
}
