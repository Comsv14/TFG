import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

function LocationMarker({ latitude, longitude, onChange }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onChange(lat, lng);
    },
  });

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude, map]);

  return latitude && longitude ? (
    <Marker position={[latitude, longitude]} icon={customMarker}></Marker>
  ) : null;
}

export default function MapPicker({ latitude, longitude, onChange }) {
  const defaultPosition = [40.4168, -3.7038]; // Madrid por defecto

  return (
    <MapContainer
      center={latitude && longitude ? [latitude, longitude] : defaultPosition}
      zoom={latitude && longitude ? 15 : 10}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        latitude={latitude}
        longitude={longitude}
        onChange={onChange}
      />
    </MapContainer>
  );
}
