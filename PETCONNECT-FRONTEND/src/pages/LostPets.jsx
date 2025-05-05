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

  // Fetch initial list
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

  // Handlers for "nuevo reporte"
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
      Object.entries(newForm).forEach(([k, v]) => {
        if (v != null) fd.append(k, v);
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

  // Handlers for sighting form (shared across cards)
  const handleSightChange = e => {
    const { name, value, files } = e.target;
    setSightForm(f => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value,
    }));
  };

  // This factory returns a bound onReport function for each pet
  const makeReportHandler = id => async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(sightForm).forEach(([k, v]) => {
        if (v != null) fd.append(k, v);
      });
      const { data } = await api.post(
        `/api/lost-pets/${id}/sightings`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      addToast('Avistamiento reportado', 'success');
      // Optionally, reload list to include new sighting
      setSightForm({});
    } catch {
      addToast('Error al reportar avistamiento', 'error');
    }
  };

  if (loading) return <p>Cargando mascotas perdidas…</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mascotas Perdidas</h2>

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

            <label className="form-label">Última ubicación</label>
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
              <label className="form-label">Foto</label>
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

      <div className="row">
        {lostList.map(pet => (
          <div className="col-md-4 mb-3" key={pet.id}>
            <LostPetCard
              pet={pet}
              sightForm={sightForm}
              onSightChange={handleSightChange}
              onReportSighting={makeReportHandler(pet.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
