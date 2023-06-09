export type TagModeType = 'character' | 'location' | 'item' | 'note'

export type TagPayloadType = {
    mode: TagModeType
    id: string
    title: string
}
