import { camelCase, without } from 'lodash'
import schema from '@sl/db/schema'

export const getInitialValues = (table: string, exclude: string[] = []) => {
    const data = without(
        Object.keys(schema.tables[table].columns),
        ...exclude.concat(['created_at', 'updated_at'])
    )
    return data.reduce((o, key) => ({ ...o, [camelCase(key)]: '' }), {})
}
