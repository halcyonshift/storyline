import { PointOfViewType } from '@sl/constants/pov'
import { SectionModeType } from '@sl/constants/sectionMode'
import { StatusType } from '@sl/constants/status'
import { CharacterModel, ItemModel, LocationModel, NoteModel, SectionModel } from '@sl/db/models'
import { CharacterModeType } from '@sl/constants/characterMode'

export type CharacterDataType = {
    mode: CharacterModeType
    status?: StatusType
    image?: string
    displayName: string
    description?: string
    history?: string
    pronouns?: string
    firstName?: string
    lastName?: string
    nickname?: string
    nationality?: string
    ethnicity?: string
    placeOfBirth?: string
    residence?: string
    gender?: string
    sexualOrientation?: string
    dateOfBirth?: string
    apparentAge?: string
    religion?: string
    socialClass?: string
    education?: string
    profession?: string
    finances?: string
    politicalLeaning?: string
    face?: string
    build?: string
    height?: string
    weight?: string
    hair?: string
    hairNatural?: string
    distinguishingFeatures?: string
    personalityPositive?: string
    personalityNegative?: string
    ambitions?: string
    fears?: string
}

type RelationType = 'parent' | 'child' | 'sibling'

export type ConnectionDataType = {
    body: string
    mode: string
    relation: RelationType
    tableA: string
    tableB: string
    idA: string
    idB: string
    to: boolean
    from: boolean
    date?: string
    color?: string
}

export type ItemDataType = {
    status?: StatusType
    name: string
    body?: string
    url?: string
    image?: string
}

export type LocationDataType = {
    status?: StatusType
    name: string
    body?: string
    latitude?: string
    longitude?: string
    url?: string
    image?: string
}

export type NoteDataType = {
    status?: StatusType
    title?: string
    body?: string
    date?: string
    url?: string
    image?: string
    color?: string
    order?: number
    isTaggable?: boolean
}

export type SectionDataType = {
    status?: StatusType
    pointOfView?: PointOfViewType
    pointOfViewCharacter?: CharacterModel
    title?: string
    mode?: SectionModeType
    body?: string
    description?: string
    date?: string
    wordGoal?: number | null
    order?: number
    deadlineAt?: Date
}

export type SprintDataType = {
    startAt: Date
    endAt: Date
    wordGoal?: number | null
}

export type SprintStatisticDataType = {
    section: SectionModel
    words: number | null
    wordsStart: number | null
}

export type StatisticDataType = number

export type WorkDataType = {
    status?: StatusType
    title: string
    author: string
    summary?: string
    language: string
    image?: string
    wordGoal?: number
    deadlineAt?: Date
    lastOpenedAt?: Date
}

export type AllTagsType = {
    text: string[]
    record: CharacterModel | ItemModel | LocationModel | NoteModel
}
