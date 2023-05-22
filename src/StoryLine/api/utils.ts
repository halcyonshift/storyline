import { readdir } from 'fs/promises'
import { join } from 'path'

export const walk = async (dirPath: string): Promise<string[]> => {
    const entries = await readdir(dirPath, { withFileTypes: true })
    const promises: Promise<string[]>[] = entries.map(async (entry) => {
        const childPath = join(dirPath, entry.name)
        return entry.isDirectory() ? walk(childPath) : [childPath]
    })
    const results: string[][] = await Promise.all(promises)
    return results.reduce((acc, result) => acc.concat(result), [])
}
