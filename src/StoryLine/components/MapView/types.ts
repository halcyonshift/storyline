import { LatLngExpression } from 'leaflet'
import { ReactElement } from 'react'

export type MapProps = {
    center?: LatLngExpression
    children?: ReactElement
}
