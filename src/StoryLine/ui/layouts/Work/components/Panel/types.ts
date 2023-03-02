/** @format */

import { CharacterModel, ItemModel, LocationModel, SectionModel } from '../../../../../db/models'
import { TabType } from '../../types'

type Panel = {
    loadTab: (focusTab: TabType) => void
}

export type CharacterPanelProps = {
    characters: CharacterModel[]
} & Panel

export type ItemPanelProps = {
    items: ItemModel[]
} & Panel

export type LocationPanelProps = {
    locations: LocationModel[]
} & Panel

export type SectionPanelProps = {
    sections: SectionModel[]
} & Panel
