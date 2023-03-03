import { appSchema, tableSchema } from '@nozbe/watermelondb'

const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'work',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'summary', type: 'string', isOptional: true },
                { name: 'author', type: 'string', isOptional: true },
                { name: 'language', type: 'string' },
                { name: 'word_goal', type: 'number', isOptional: true },
                { name: 'deadline_at', type: 'number', isOptional: true },
                { name: 'last_opened_at', type: 'number', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'section',
            columns: [
                { name: 'title', type: 'string', isOptional: true },
                { name: 'mode', type: 'string' },
                { name: 'body', type: 'string', isOptional: true },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'order', type: 'number' },
                { name: 'words', type: 'number', isOptional: true },
                { name: 'date', type: 'string', isOptional: true },
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'section_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'deadline_at', type: 'number', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'statistic',
            columns: [
                { name: 'words', type: 'number', isOptional: true },
                { name: 'section_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'annotation',
            columns: [
                { name: 'title', type: 'string', isOptional: true },
                { name: 'body', type: 'string', isOptional: true },
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'section_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'character_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'item_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'location_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'color', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'character',
            columns: [
                { name: 'mode', type: 'string' },
                { name: 'display_name', type: 'string' },
                { name: 'pronouns', type: 'string', isOptional: true },
                { name: 'first_name', type: 'string', isOptional: true },
                { name: 'last_name', type: 'string', isOptional: true },
                { name: 'nickname', type: 'string', isOptional: true },
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'gender', type: 'string', isOptional: true },
                { name: 'apparent_age', type: 'number', isOptional: true },
                { name: 'date_of_birth', type: 'string', isOptional: true },
                { name: 'place_of_birth', type: 'string', isOptional: true },
                { name: 'apparent_age', type: 'number', isOptional: true },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'body', type: 'string', isOptional: true },
                { name: 'education', type: 'string', isOptional: true },
                { name: 'profession', type: 'string', isOptional: true },
                { name: 'finances', type: 'string', isOptional: true },
                { name: 'residence', type: 'string', isOptional: true },
                { name: 'race', type: 'string', isOptional: true },
                { name: 'build', type: 'string', isOptional: true },
                { name: 'height', type: 'string', isOptional: true },
                { name: 'weight', type: 'string', isOptional: true },
                { name: 'hair', type: 'string', isOptional: true },
                { name: 'face', type: 'string', isOptional: true },
                { name: 'eyes', type: 'string', isOptional: true },
                { name: 'nose', type: 'string', isOptional: true },
                { name: 'mouth', type: 'string', isOptional: true },
                { name: 'ears', type: 'string', isOptional: true },
                { name: 'hands', type: 'string', isOptional: true },
                { name: 'distinguishing_features', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'conflict', type: 'string', isOptional: true },
                { name: 'evolution', type: 'string', isOptional: true }
            ]
        }),
        tableSchema({
            name: 'location',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'body', type: 'string', isOptional: true },
                { name: 'longitude', type: 'string', isOptional: true },
                { name: 'latitude', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'location_id', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'item',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'body', type: 'string' },
                { name: 'date', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'note',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'body', type: 'string' },
                { name: 'date', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'character_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'item_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'location_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        })
    ]
})

export default schema
