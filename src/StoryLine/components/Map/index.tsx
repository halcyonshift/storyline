import { MapContainer, TileLayer } from 'react-leaflet'
import { MapProps } from './types'
import './map.css'

const Map = ({ center, children }: MapProps) => (
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
        <TileLayer url='https://{s}.tile.osm.org/{z}/{x}/{y}.png' />
        {children}
    </MapContainer>
)

export default Map
