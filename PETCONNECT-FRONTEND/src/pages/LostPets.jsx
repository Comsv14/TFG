// src/pages/LostPets.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function LostPets({ addToast, user }) {
  const [lostPets, setLostPets] = useState([]);
  const [forms, setForms] = useState({}); // { [petId]: { comment, latitude, longitude, photo } }

  // Load all lost pets with their sightings
  useEffect(() => {
    fetchLostPets();
  }, []);

  const fetchLostPets = async () => {
    try {
      const { data } = await api.get('/api/lost-pets');
      setLostPets(data);
    } catch {
      addToast('Error al cargar mascotas perdidas', 'error');
    }
  };

  // Handle form field changes per pet
  const handleFormChange = (petId, field, value) => {
    setForms(f => ({
      ...f,
      [petId]: {
        ...f[petId],
        [field]: value
      }
    }));
  };

  // Submit a new sighting (comment) for a given pet
  const handleSightingSubmit = async petId => {
    const f = forms[petId] || {};
    const fd = new FormData();
    if (f.comment) fd.append('comment', f.comment);
    if (typeof f.latitude === 'number') fd.append('latitude', f.latitude);
    if (typeof f.longitude === 'number') fd.append('longitude', f.longitude);
    if (f.photo) fd.append('photo', f.photo);

    try {
      await api.post(`/api/lost-pets/${petId}/sightings`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Avistamiento reportado', 'success');
      // clear form for this pet
      setForms(fm => ({ ...fm, [petId]: {} }));
      fetchLostPets();
    } catch {
      addToast('Error al reportar avistamiento', 'error');
    }
  };

  return (
    <div className="row">
      {lostPets.map(pet => {
        const f = forms[pet.id] || {};
        return (
          <div key={pet.id} className="col-md-6 mb-4">
            <div className="card h-100">
              {pet.photo && (
                <img
                  src={pet.photo}
                  className="card-img-top"
                  alt={pet.pet_name}
                  style={{ objectFit: 'cover', height: '250px' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{pet.pet_name}</h5>
                {pet.description && <p className="card-text">{pet.description}</p>}
                {pet.last_seen_location && (
                  <p className="text-muted mb-1">
                    <strong>Última ubicación:</strong> {pet.last_seen_location}
                  </p>
                )}
                <p className="text-muted mb-3">
                  <small>Reportado: {new Date(pet.posted_at).toLocaleString()}</small>
                </p>

                <hr />

                <h6>Avistamientos</h6>
                {pet.sightings && pet.sightings.length > 0 ? (
                  pet.sightings.map(s => (
                    <div key={s.id} className="mb-3">
                      <div>
                        <strong>{s.user.name}</strong>{' '}
                        <small className="text-muted">
                          ({new Date(s.created_at).toLocaleString()})
                        </small>
                      </div>
                      {s.comment && <p>{s.comment}</p>}
                      {s.photo && (
                        <img
                          src={s.photo}
                          alt="avistamiento"
                          className="img-fluid mb-2"
                          style={{ maxHeight: '120px' }}
                        />
                      )}
                      {(typeof s.latitude === 'number' && typeof s.longitude === 'number') && (
                        <small className="text-muted">
                          Coordenadas: {s.latitude.toFixed(5)}, {s.longitude.toFixed(5)}
                        </small>
                      )}
                      <hr className="my-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Sin avistamientos todavía.</p>
                )}

                <hr />

                <h6>Nuevo avistamiento</h6>
                <textarea
                  className="form-control mb-2"
                  placeholder="Tu comentario..."
                  value={f.comment || ''}
                  onChange={e => handleFormChange(pet.id, 'comment', e.target.value)}
                />

                <label className="form-label mb-1">Ubicación</label>
                <MapPicker
                  latitude={f.latitude}
                  longitude={f.longitude}
                  onChange={(lat, lng) => {
                    handleFormChange(pet.id, 'latitude', lat);
                    handleFormChange(pet.id, 'longitude', lng);
                  }}
                />

                <div className="mb-3 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={e => handleFormChange(pet.id, 'photo', e.target.files[0])}
                  />
                </div>

                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleSightingSubmit(pet.id)}
                >
                  Publicar comentario
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
