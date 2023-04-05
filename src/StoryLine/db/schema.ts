import { appSchema, tableSchema } from '@nozbe/watermelondb'

const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'character',
            columns: [
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'mode', type: 'string' },
                { name: 'status', type: 'string', isIndexed: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'display_name', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'history', type: 'string', isOptional: true },
                { name: 'pronouns', type: 'string', isOptional: true },
                { name: 'first_name', type: 'string', isOptional: true },
                { name: 'last_name', type: 'string', isOptional: true },
                { name: 'nickname', type: 'string', isOptional: true },
                { name: 'nationality', type: 'string', isOptional: true },
                { name: 'ethnicity', type: 'string', isOptional: true },
                { name: 'place_of_birth', type: 'string', isOptional: true },
                { name: 'residence', type: 'string', isOptional: true },
                { name: 'gender', type: 'string', isOptional: true },
                { name: 'sexual_orientation', type: 'string', isOptional: true },
                { name: 'date_of_birth', type: 'string', isOptional: true },
                { name: 'apparent_age', type: 'string', isOptional: true },
                { name: 'religion', type: 'string', isOptional: true },
                { name: 'social_class', type: 'string', isOptional: true },
                { name: 'education', type: 'string', isOptional: true },
                { name: 'profession', type: 'string', isOptional: true },
                { name: 'finances', type: 'string', isOptional: true },
                { name: 'political_leaning', type: 'string', isOptional: true },
                { name: 'face', type: 'string', isOptional: true },
                { name: 'build', type: 'string', isOptional: true },
                { name: 'height', type: 'string', isOptional: true },
                { name: 'weight', type: 'string', isOptional: true },
                { name: 'hair', type: 'string', isOptional: true },
                { name: 'hair_natural', type: 'string', isOptional: true },
                { name: 'distinguishing_features', type: 'string', isOptional: true },
                { name: 'personality_positive', type: 'string', isOptional: true },
                { name: 'personality_negative', type: 'string', isOptional: true },
                { name: 'ambitions', type: 'string', isOptional: true },
                { name: 'fears', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
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
        }),
        tableSchema({
            name: 'item',
            columns: [
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'body', type: 'string' },
                { name: 'date', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'status', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'location',
            columns: [
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'location_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'body', type: 'string', isOptional: true },
                { name: 'longitude', type: 'string', isOptional: true },
                { name: 'latitude', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'status', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'note',
            columns: [
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'character_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'item_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'location_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'note_id', type: 'string', isIndexed: true },
                { name: 'section_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'title', type: 'string' },
                { name: 'body', type: 'string' },
                { name: 'date', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'color', type: 'string', isOptional: true },
                { name: 'url', type: 'string', isOptional: true },
                { name: 'order', type: 'number', isOptional: true },
                { name: 'status', type: 'string', isIndexed: true },
                { name: 'is_taggable', type: 'boolean', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'section',
            columns: [
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'section_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'title', type: 'string', isOptional: true },
                { name: 'mode', type: 'string' },
                { name: 'body', type: 'string', isOptional: true },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'order', type: 'number' },
                { name: 'date', type: 'string', isOptional: true },
                { name: 'word_goal', type: 'number', isOptional: true },
                { name: 'word_goal_per_day', type: 'number', isOptional: true },
                { name: 'deadline_at', type: 'number', isOptional: true },
                { name: 'status', type: 'string', isIndexed: true },
                { name: 'point_of_view', type: 'string', isOptional: true },
                { name: 'point_of_view_character_id', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'statistic',
            columns: [
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'section_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'words', type: 'number', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'tag',
            columns: [
                { name: 'work_id', type: 'string', isIndexed: true },
                { name: 'character_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'item_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'location_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'note_id', type: 'string', isIndexed: true },
                { name: 'section_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'work',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'summary', type: 'string', isOptional: true },
                { name: 'author', type: 'string', isOptional: true },
                { name: 'language', type: 'string' },
                { name: 'word_goal', type: 'number', isOptional: true },
                { name: 'word_goal_per_day', type: 'number', isOptional: true },
                { name: 'deadline_at', type: 'number', isOptional: true },
                { name: 'image', type: 'string', isOptional: true },
                { name: 'last_opened_at', type: 'number', isOptional: true },
                { name: 'status', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        })
    ]
})

export default schema
