import { Model } from '@nozbe/watermelondb'
import { text, writer } from '@nozbe/watermelondb/decorators'
import { StyleDataType } from './types'

export default class StyleModel extends Model {
    static table = 'style'

    @text('label') label!: string
    @text('body') body!: string

    @writer async updateRecord(data: Partial<StyleDataType>) {
        await this.update((style) => {
            for (const [key, value] of Object.entries(data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(style as any)[key] = value
            }
        })
    }

    @writer async delete() {
        await this.destroyPermanently()
        return true
    }
}
