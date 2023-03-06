import { ReactElement } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import './map.css'

const Map = ({ children }: { children?: ReactElement }) => (
    <MapContainer
        center={[51.505, -0.09]}
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
