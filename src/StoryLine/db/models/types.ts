export type AnnotationDataType = {
    title: string
    body?: string
    color?: string
    url?: string
    image?: string
}

export type CharacterDataType = {
    mode: 'main' | 'secondary' | 'tertiary'
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
    name: string
    body?: string
    url?: string
    image?: string
}

export type LocationDataType = {
    name: string
    body?: string
    latitude?: string
    longitude?: string
    url?: string
    image?: string
}

export type SectionDataType = {
    title: string
    mode?: 'chapter' | 'scene' | 'part' | 'revision'
    body?: string
    description?: string
    date?: string
    words?: number
    order?: number
    deadlineAt?: Date
}

export type StatisticDataType = {
    words?: number
}

export type WorkDataType = {
    title: string
    author?: string
    summary?: string
    language?: string
    wordGoal?: number
    deadlineAt?: Date
    lastOpenedAt?: Date
}
