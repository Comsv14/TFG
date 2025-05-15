import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
}

export default function ActivityMap({ location, onLocationSelect }) {
  const defaultPosition = location || { lat: 40.4168, lng: -3.7038 }; // Madrid

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <LocationSelector onLocationSelect={onLocationSelect} />
      {location && <Marker position={location} />}
    </MapContainer>
  );
}
