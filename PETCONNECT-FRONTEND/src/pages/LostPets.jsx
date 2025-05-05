// src/pages/LostPets.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/axios';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Haversine para distancia en km
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Icono por defecto Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
});

export default function LostPets({ addToast, user }) {
  const [lostPets, setLostPets] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    fromDate: '',
    toDate: '',
    nearMe: false,
    maxKm: 20,
    recentFirst: true,
  });

  // carga inicial
  const fetchLostPets = useCallback(async () => {
    try {
      const { data } = await api.get('/api/lost-pets');
      setLostPets(data);
    } catch {
      addToast('Error cargando registros de pérdidas', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchLostPets();
  }, [fetchLostPets]);

  // Provincias únicas extraídas de last_seen_location
  const provinces = useMemo(() => {
    return Array.from(new Set(
      lostPets.map(p => p.last_seen_location).filter(Boolean)
    ));
  }, [lostPets]);

  // Lista filtrada y ordenada
  const filtered = useMemo(() => {
    let arr = lostPets.filter(p => {
      // filtro por nombre
      if (filters.name && !p.pet_name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      // filtro por fecha
      const dt = new Date(p.posted_at);
      if (filters.fromDate && dt < new Date(filters.fromDate)) return false;
      if (filters.toDate && dt > new Date(filters.toDate))   return false;
      // filtro cerca de mí
      if (filters.nearMe && user.latitude && user.longitude) {
        const km = distanceKm(
          user.latitude, user.longitude,
          p.last_seen_latitude, p.last_seen_longitude
        );
        if (km > filters.maxKm) return false;
      }
      return true;
    });

    // ordenar por fecha
    arr = arr.sort((a, b) => {
      const da = new Date(a.posted_at), db = new Date(b.posted_at);
      return filters.recentFirst ? db - da : da - db;
    });

    return arr;
  }, [lostPets, filters, user]);

  return (
    <>
      <h1>Mascotas Perdidas</h1>

      {/* → PANEL DE FILTROS ← */}
      <Card className="p-3 mb-4">
        <Row className="gy-2">
          <Col md>
            <Form.Control
              placeholder="Buscar por nombre..."
              value={filters.name}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
            />
          </Col>
          <Col md>
            <Form.Control
              type="date"
              placeholder="Desde"
              value={filters.fromDate}
              onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
            />
          </Col>
          <Col md>
            <Form.Control
              type="date"
              placeholder="Hasta"
              value={filters.toDate}
              onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
            />
          </Col>
          <Col md>
            <Form.Select
              value={filters.province}
              onChange={e => setFilters(f => ({ ...f, province: e.target.value }))}
            >
              <option value="">Todas las provincias</option>
              {provinces.map(pr => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md="auto" className="d-flex align-items-center">
            <Form.Check 
              type="checkbox"
              label={`Cerca de mí (${filters.maxKm} km)`}
              checked={filters.nearMe}
              onChange={e => setFilters(f => ({ ...f, nearMe: e.target.checked }))}
            />
          </Col>
          <Col md="auto" className="d-flex align-items-center">
            <Form.Check 
              type="checkbox"
              label="Más recientes primero"
              checked={filters.recentFirst}
              onChange={e => setFilters(f => ({ ...f, recentFirst: e.target.checked }))}
            />
          </Col>
        </Row>
      </Card>

      {/* → GRID DE TARJETAS ← */}
      <Row>
        {filtered.length === 0 && (
          <Col>
            <p className="text-center text-muted">No hay mascotas que coincidan.</p>
          </Col>
        )}

        {filtered.map(p => (
          <Col md={6} lg={4} key={p.id} className="mb-4">
            <Card className="h-100">
              {p.photo && (
                <Card.Img
                  variant="top"
                  src={p.photo}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title>{p.pet_name}</Card.Title>
                {p.description && <Card.Text>{p.description}</Card.Text>}

                <div style={{ height: '150px', marginBottom: '1rem' }}>
                  <MapContainer
                    center={[p.last_seen_latitude, p.last_seen_longitude]}
                    zoom={13}
                    dragging={false}
                    doubleClickZoom={false}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[p.last_seen_latitude, p.last_seen_longitude]} />
                  </MapContainer>
                </div>

                <small className="text-muted mb-2">
                  Reportado: {new Date(p.posted_at).toLocaleString()}
                </small>

                <div className="mt-auto">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      /* aquí podrías abrir un modal con mayor info */
                    }}
                  >
                    Ver detalles
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
