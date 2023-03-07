import { ReactElement } from 'react'
import { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import './map.css'

const Map = ({ center, children }: { center?: LatLngExpression; children?: ReactElement }) => (
    <MapContainer
        center={center || [51.51531376950311, -0.12632316009655253]}
        zoom={6}
        maxZoom={10}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        easeLinearity={0.35}>
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
        {children}
    </MapContainer>
)

export default Map
