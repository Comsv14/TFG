// src/components/MapPicker.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
});

// Componente MapPicker
export default function MapPicker({ latitude, longitude, onChange, readOnly = false }) {
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (!readOnly && onChange) {
          const { lat, lng } = e.latlng;
          onChange(lat, lng);
        }
      },
    });

    return latitude && longitude ? <Marker position={[latitude, longitude]} /> : null;
  };

  return (
    <MapContainer
      center={[latitude || 40.4168, longitude || -3.7038]}
      zoom={13}
      style={{ height: 300 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}
