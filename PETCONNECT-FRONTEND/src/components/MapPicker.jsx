// PETCONNECT-FRONTEND/src/components/MapPicker.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Configuración de iconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
});

export default function MapPicker({ latitude, longitude, onChange }) {
  const [pos, setPos] = useState([
    latitude ?? 40.4168,
    longitude ?? -3.7038,
  ]);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      setPos([latitude, longitude]);
    }
  }, [latitude, longitude]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPos([lat, lng]);
        onChange(lat, lng);
      },
    });
    return <Marker position={pos} />;
  }

  return (
    <MapContainer
      center={pos}
      zoom={latitude != null && longitude != null ? 13 : 6}
      minZoom={2}
      maxZoom={18}
      style={{ height: '300px', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
