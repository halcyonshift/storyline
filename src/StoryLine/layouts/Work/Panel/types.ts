import { ReactNode } from 'react'
import { TooltipIconButtonProps } from '@sl/components/TooltipIconButton/types'
import { CharacterModel, ItemModel, LocationModel, SectionModel } from '@sl/db/models'
import { TabType } from '../types'

export type PanelProps = {
    navigation: TooltipIconButtonProps[]
    children?: ReactNode
}

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
