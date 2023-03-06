import { MapContainer, TileLayer } from 'react-leaflet'
import './map.css'

const Map = () => (
    <MapContainer
        center={[50, 10]}
        zoom={6}
        maxZoom={10}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        easeLinearity={0.35}>
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
    </MapContainer>
)

export default Map
