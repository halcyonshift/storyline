export type CharacterDataType = {
    mode: 'primary' | 'secondary' | 'tertiary'
    status?: string
    displayName: string
    pronouns?: string
    firstName?: string
    lastName?: string
    nickname?: string
    gender?: string
    apparentAge?: number
    dateOfBirth?: string
    placeOfBirth?: string
    education?: string
    profession?: string
    finances?: string
    residence?: string
    race?: string
    build?: string
    height?: string
    weight?: string
    hair?: string
    face?: string
    eyes?: string
    nose?: string
    mouth?: string
    ears?: string
    hands?: string
    distinguishingFeatures?: string
    description?: string
    body?: string
    image?: string
    conflict?: string
    evolution?: string
}

export type ItemDataType = {
    status?: string
    name: string
    body?: string
    url?: string
    image?: string
}

export type LocationDataType = {
    status?: string
    name: string
    body?: string
    latitude?: string
    longitude?: string
    url?: string
    image?: string
}

export type NoteDataType = {
    status?: string
    title?: string
    body?: string
    date?: string
    url?: string
    image?: string
    color?: string
    order?: number
}

export type SectionDataType = {
    status?: string
    title?: string
    mode?: 'chapter' | 'scene' | 'part' | 'revision'
    body?: string
    description?: string
    date?: string
    wordGoal?: number | null
    order?: number
    deadlineAt?: Date
}

export type StatisticDataType = {
    words?: number
}

export type WorkDataType = {
    status?: string
    title: string
    author: string
    summary?: string
    language: string
    image?: string
    wordGoal?: number
    deadlineAt?: Date
    lastOpenedAt?: Date
}
