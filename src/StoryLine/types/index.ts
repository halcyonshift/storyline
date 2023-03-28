import { DateTime } from 'luxon'

export type AutocompleteOption = {
    id: string
    label: string
}

export type ObjectNumber = {
    [key: string]: number
}

export type ObjectDateTime = {
    [key: string]: DateTime
}
