import { createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                createTable({
                    name: 'connection',
                    columns: [
                        { name: 'work_id', type: 'string', isIndexed: true },
                        { name: 'table_a', type: 'string' },
                        { name: 'table_b', type: 'string' },
                        { name: 'id_a', type: 'string' },
                        { name: 'id_b', type: 'string' },
                        { name: 'mode', type: 'string' },
                        { name: 'to', type: 'boolean' },
                        { name: 'from', type: 'boolean' },
                        { name: 'body', type: 'string' },
                        { name: 'date', type: 'string', isOptional: true },
                        { name: 'color', type: 'string', isOptional: true },
                        { name: 'created_at', type: 'number' },
                        { name: 'updated_at', type: 'number' }
                    ]
                })
            ]
        }
    ]
})
