import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Fragment,
} from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';

/* -------------------------------------------------
   Leaflet – icono por defecto (CDN)
-------------------------------------------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
});

/* -------------------------------------------------
   Utilidad: distancia Haversine (km)
-------------------------------------------------- */
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* -------------------------------------------------
   Componente
-------------------------------------------------- */
export default function LostPets({ addToast, user }) {
  const [lostPets, setLostPets] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  /* ------------------ Filtros ------------------ */
  const [filters, setFilters] = useState({
    name: '',
    province: '',
    fromDate: '',
    toDate: '',
    nearMe: false,
    maxKm: 20,
    recentFirst: true,
  });

  /* ------------------ Fetch ------------------ */
  const fetchLostPets = useCallback(async () => {
    try {
      const res = await api.get('/api/lost-pets');
      // la API devuelve LostPetResource collection
      setLostPets(res.data.data ?? res.data);
    } catch {
      addToast('Error cargando pérdidas', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchLostPets();
  }, [fetchLostPets]);

  /* ---------- Provincias únicas ---------- */
  const provinces = useMemo(
    () =>
      Array.from(
        new Set(
          lostPets
            .map((p) => p.location)
            .filter((loc) => loc && loc.trim() !== '')
        )
      ),
    [lostPets]
  );

  /* ---------- Aplicar filtros + sort ---------- */
  const filtered = useMemo(() => {
    let arr = lostPets.filter((p) => {
      // por nombre
      if (
        filters.name &&
        !p.pet.name.toLowerCase().includes(filters.name.toLowerCase())
      )
        return false;
      // por provincia
      if (filters.province && p.location !== filters.province) return false;
      // por fecha
      const dt = new Date(p.posted_at);
      if (filters.fromDate && dt < new Date(filters.fromDate)) return false;
      if (filters.toDate && dt > new Date(filters.toDate)) return false;
      // cerca de mí
      if (filters.nearMe && user?.latitude && user?.longitude) {
        const km = distanceKm(
          user.latitude,
          user.longitude,
          p.lat,
          p.lng
        );
        if (km > filters.maxKm) return false;
      }
      return true;
    });

    arr.sort((a, b) => {
      const da = new Date(a.posted_at),
        db = new Date(b.posted_at);
      return filters.recentFirst ? db - da : da - db;
    });

    return arr;
  }, [lostPets, filters, user]);

  /* ---------- Toggle detalles ---------- */
  const toggleDetails = (id) =>
    setExpandedId(expandedId === id ? null : id);

  /* ---------- Render ---------- */
  return (
    <Fragment>
      <h1 className="mb-4">Mascotas Perdidas</h1>

      {/* -------- PANEL DE FILTROS -------- */}
      <div className="card mb-4 p-3">
        <div className="row g-2">
          <div className="col-md">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={filters.name}
              onChange={(e) =>
                setFilters((f) => ({ ...f, name: e.target.value }))
              }
            />
          </div>
          <div className="col-md">
            <select
              className="form-select"
              value={filters.province}
              onChange={(e) =>
                setFilters((f) => ({ ...f, province: e.target.value }))
              }
            >
              <option value="">Todas las provincias</option>
              {provinces.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md">
            <input
              type="date"
              className="form-control"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fromDate: e.target.value }))
              }
            />
          </div>
          <div className="col-md">
            <input
              type="date"
              className="form-control"
              value={filters.toDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, toDate: e.target.value }))
              }
            />
          </div>
          <div className="col-auto d-flex align-items-center">
            <div className="form-check me-3">
              <input
                id="nearMe"
                type="checkbox"
                className="form-check-input"
                checked={filters.nearMe}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, nearMe: e.target.checked }))
                }
              />
              <label htmlFor="nearMe" className="form-check-label">
                Cerca de mí ({filters.maxKm} km)
              </label>
            </div>
            <div className="form-check">
              <input
                id="recentFirst"
                type="checkbox"
                className="form-check-input"
                checked={filters.recentFirst}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    recentFirst: e.target.checked,
                  }))
                }
              />
              <label htmlFor="recentFirst" className="form-check-label">
                Más recientes primero
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* -------- GRID DE TARJETAS -------- */}
      <div className="row">
        {filtered.length === 0 && (
          <div className="col-12 text-center text-muted my-5">
            No hay mascotas que coincidan.
          </div>
        )}

        {filtered.map((p) => (
          <div key={p.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              {/* foto del reporte o, si no, mapa estático */}
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.pet.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${p.lng},${p.lat})/${p.lng},${p.lat},13/300x200?access_token=pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2s4b2E0cHlvMDMxZDNqcGd2OXc1MGxkMSJ9.48tRArrVJPHWgIqi6qVrbA`}
                  alt="map"
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.pet.name}</h5>

                {p.comment && <p className="card-text">{p.comment}</p>}

                <p className="mb-1">
                  <strong>Ubicación:</strong> {p.location ?? '—'}
                </p>
                <p className="text-muted mb-3">
                  Reportado: {new Date(p.posted_at).toLocaleDateString()}
                </p>

                <button
                  className="btn btn-primary btn-sm mt-auto"
                  onClick={() => toggleDetails(p.id)}
                >
                  {expandedId === p.id ? 'Ocultar detalles' : 'Ver detalles'}
                </button>

                {/* Detalles expandibles */}
                {expandedId === p.id && (
                  <div className="mt-3">
                    {p.lat != null && p.lng != null && (
                      <div style={{ height: '200px', width: '100%' }}>
                        <MapContainer
                          center={[p.lat, p.lng]}
                          zoom={13}
                          dragging={false}
                          doubleClickZoom={false}
                          scrollWheelZoom={false}
                          zoomControl={false}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[p.lat, p.lng]} />
                        </MapContainer>
                      </div>
                    )}

                    <p className="mt-2">
                      <strong>Coordenadas:</strong>{' '}
                      {p.lat?.toFixed(5)}, {p.lng?.toFixed(5)}
                    </p>
                    <p>
                      <strong>Reportado por:</strong>{' '}
                      {p.user?.name ?? 'Desconocido'}
                    </p>
                    <Link
                      to={`/lost-pets/${p.id}`}
                      className="btn btn-outline-secondary btn-sm w-100"
                    >
                      Página de detalles
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
