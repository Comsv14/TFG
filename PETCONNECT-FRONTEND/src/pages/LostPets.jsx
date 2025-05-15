import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';

/* Leaflet default icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/* Component */
export default function LostPets({ addToast, user }) {
  const [lostPets, setLostPets] = useState([]);
  const [tab, setTab] = useState('lost'); // 'lost' | 'found'
  const [expandedId, setExpandedId] = useState(null);

  /* Fetch lost pets */
  const fetchLostPets = useCallback(async () => {
    try {
      const res = await api.get('/api/lost-reports');
      setLostPets(res.data);
    } catch {
      addToast('Error cargando mascotas perdidas', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchLostPets();
  }, [fetchLostPets]);

  /* Mark as found (only for owner) */
  const markAsFound = async (id) => {
    try {
      await api.post(`/api/lost-reports/${id}/toggle-resolved`);
      addToast('Mascota marcada como encontrada', 'success');
      fetchLostPets();
    } catch {
      addToast('Error al marcar como encontrada', 'error');
    }
  };

  /* Filtered list */
  const filtered = useMemo(() => {
    return lostPets.filter(p => (tab === 'lost' ? !p.resolved : p.resolved));
  }, [lostPets, tab]);

  /* Toggle details */
  const toggleDetails = (id) =>
    setExpandedId(expandedId === id ? null : id);

  return (
    <Fragment>
      <h1 className="mb-4">Mascotas Perdidas y Encontradas</h1>

      {/* Tabs */}
      <div className="mb-3">
        <button
          className={`btn ${tab === 'lost' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTab('lost')}
        >
          Mascotas Perdidas
        </button>
        <button
          className={`btn ms-2 ${tab === 'found' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTab('found')}
        >
          Mascotas Encontradas
        </button>
      </div>

      {/* List of Lost Pets */}
      <div className="row">
        {filtered.length === 0 ? (
          <p className="text-muted">No hay mascotas en esta categoría.</p>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="col-md-6 mb-4">
              <div className="card">
                {p.photo && (
                  <img src={p.photo} alt={p.pet_name || 'Mascota'} className="card-img-top" style={{ height: 200, objectFit: 'cover' }} />
                )}
                <div className="card-body">
                  <h5 className="card-title">
                    {p.type === 'lost'
                      ? p.pet?.name || 'Mascota Perdida'
                      : p.pet_name || 'Mascota Encontrada'}
                  </h5>
                  <p>{p.comment}</p>
                  {p.latitude && p.longitude && (
                    <p><strong>Ubicación:</strong> [{p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}]</p>
                  )}
                  <p><strong>Fecha:</strong> {new Date(p.happened_at).toLocaleString()}</p>

                  <button
                    className="btn btn-sm btn-info mt-2"
                    onClick={() => toggleDetails(p.id)}
                  >
                    {expandedId === p.id ? 'Ocultar detalles' : 'Ver detalles'}
                  </button>

                  {expandedId === p.id && (
                    <div className="mt-3">
                      {p.latitude && p.longitude && (
                        <MapContainer
                          center={[p.latitude, p.longitude]}
                          zoom={14}
                          style={{ height: 200 }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[p.latitude, p.longitude]} />
                        </MapContainer>
                      )}

                      <p className="mt-3">
                        <strong>Reportado por:</strong> {p.user?.name || 'Desconocido'}
                      </p>
                      <p>
                        <strong>Comentario:</strong> {p.comment}
                      </p>

                      {/* Mark as found button (only owner) */}
                      {user?.id === p.user?.id && !p.resolved && (
                        <button
                          className="btn btn-success mt-3"
                          onClick={() => markAsFound(p.id)}
                        >
                          Marcar como encontrada
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Fragment>
  );
}
