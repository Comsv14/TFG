// PETCONNECT-FRONTEND/src/pages/LostPets.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LostPetCard from '../components/LostPetCard';
import MapPicker from '../components/MapPicker';

export default function LostPets({ addToast }) {
  const [lostList, setLostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newForm, setNewForm] = useState({
    pet_name: '',
    description: '',
    last_seen_latitude: null,
    last_seen_longitude: null,
    photo: null,
  });
  const [sightForm, setSightForm] = useState({});

  // Al cargar la página, traemos las mascotas perdidas
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/lost-pets');
        setLostList(data);
      } catch {
        addToast('Error al cargar mascotas perdidas', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [addToast]);

  // Manejadores de formulario de nueva pérdida
  const handleLostChange = e => {
    const { name, value, files } = e.target;
    setNewForm(f => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value,
    }));
  };

  const handleAddLostPet = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(newForm).forEach(([key, val]) => {
        if (val != null) fd.append(key, val);
      });
      const { data } = await api.post('/api/lost-pets', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLostList(l => [data, ...l]);
      addToast('Mascota perdida reportada', 'success');
      setNewForm({
        pet_name: '',
        description: '',
        last_seen_latitude: null,
        last_seen_longitude: null,
        photo: null,
      });
    } catch {
      addToast('Error al reportar mascota perdida', 'error');
    }
  };

  // Manejadores de formulario de avistamiento
  const handleSightChange = e => {
    const { name, value, files } = e.target;
    setSightForm(f => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value,
    }));
  };

  const handleReport = async (e, id) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(sightForm).forEach(([key, val]) => {
        if (val != null) fd.append(key, val);
      });
      await api.post(`/api/lost-pets/${id}/sightings`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      addToast('Avistamiento reportado', 'success');
      setSightForm({});
    } catch {
      addToast('Error al reportar avistamiento', 'error');
    }
  };

  if (loading) return <p>Cargando mascotas perdidas…</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mascotas Perdidas</h2>

      {/* Formulario de nueva pérdida */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Reportar mascota perdida</h5>
          <form onSubmit={handleAddLostPet}>
            <input
              name="pet_name"
              className="form-control mb-2"
              placeholder="Nombre de la mascota"
              value={newForm.pet_name}
              onChange={handleLostChange}
              required
            />

            <textarea
              name="description"
              className="form-control mb-2"
              placeholder="Descripción"
              value={newForm.description}
              onChange={handleLostChange}
            />

            <label className="form-label">Última ubicación (pincha en el mapa)</label>
            <MapPicker
              latitude={newForm.last_seen_latitude}
              longitude={newForm.last_seen_longitude}
              onChange={(lat, lng) =>
                setNewForm(f => ({
                  ...f,
                  last_seen_latitude: lat,
                  last_seen_longitude: lng,
                }))
              }
            />

            <div className="mb-3 mt-3">
              <label className="form-label">Foto de la mascota</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="form-control"
                onChange={handleLostChange}
              />
            </div>

            <button className="btn btn-danger">Publicar</button>
          </form>
        </div>
      </div>

      {/* Listado de pérdidas */}
      <div className="row">
        {lostList.map(pet => (
          <div className="col-md-4 mb-3" key={pet.id}>
            <LostPetCard pet={pet}>
              {/* Formulario de avistamiento dentro de cada tarjeta */}
              <form onSubmit={e => handleReport(e, pet.id)} className="mt-3">
                <textarea
                  name="comment"
                  className="form-control mb-2"
                  placeholder="Comentario (opcional)"
                  value={sightForm.comment || ''}
                  onChange={handleSightChange}
                />

                <label className="form-label">Ubicación del avistamiento</label>
                <MapPicker
                  latitude={sightForm.latitude}
                  longitude={sightForm.longitude}
                  onChange={(lat, lng) =>
                    setSightForm(f => ({ ...f, latitude: lat, longitude: lng }))
                  }
                />

                <div className="mb-3 mt-2">
                  <label className="form-label">Foto (opcional)</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="form-control"
                    onChange={handleSightChange}
                  />
                </div>

                <button className="btn btn-warning btn-sm">Avisar</button>
              </form>
            </LostPetCard>
          </div>
        ))}
      </div>
    </div>
  );
}
