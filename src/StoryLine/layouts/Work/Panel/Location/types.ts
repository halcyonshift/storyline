import { LocationModel } from '@sl/db/models'

export type NodeType = {
    data?: LocationModel
    children?: NodeType[]
}

export type NodeGroupType = {
    [key: string]: NodeType
}
