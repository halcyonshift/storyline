import { useDatabase } from '@nozbe/watermelondb/hooks'

const databaseTables: string[] = [
    'character',
    'item',
    'location',
    'note',
    'section',
    'statistic',
    'work'
]

export const exportDB = async () => {
    const database = useDatabase()

    const data = []

    for await (const table of databaseTables) {
        const records = await database.get(table).query().fetch()
        data.push(records)
    }
}
