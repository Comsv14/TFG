import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuración del icono de marcador predeterminado
const customMarker = new L.Icon({
  iconUrl: L.Icon.Default.prototype._getIconUrl('marker-icon.png'),
  iconRetinaUrl: L.Icon.Default.prototype._getIconUrl('marker-icon-2x.png'),
  shadowUrl: L.Icon.Default.prototype._getIconUrl('marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ActivityMap({ latitude, longitude }) {
  const position = [latitude, longitude];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '200px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={position} icon={customMarker} />
    </MapContainer>
  );
}
