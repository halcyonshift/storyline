import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

import migrations from '../migrations'
import schema from '../schema'

const adapter = new LokiJSAdapter({
    schema,
    migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    dbName: 'wmdb-jest',
    extraLokiOptions: {
        autosave: false
    }
})

export default adapter
