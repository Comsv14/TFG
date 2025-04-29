// PETCONNECT-FRONTEND/src/components/LostPetForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';

export default function LostPetForm({ onReport, addToast }) {
  const [form, setForm] = useState({
    pet_name: '',
    description: '',
    last_seen_location: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('pet_name', form.pet_name);
      fd.append('description', form.description);
      fd.append('last_seen_location', form.last_seen_location);
      if (form.photo) fd.append('photo', form.photo);

      const { data } = await api.post('/api/lost-pets', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onReport(data);
      addToast('Mascota perdida reportada', 'success');
      setForm({
        pet_name: '',
        description: '',
        last_seen_location: '',
        photo: null
      });
    } catch (err) {
      console.error(err);
      addToast('Error al reportar la mascota perdida', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Reportar mascota perdida</h5>
        <form onSubmit={handleSubmit}>
          <input
            name="pet_name"
            className="form-control mb-2"
            placeholder="Nombre de la mascota"
            value={form.pet_name}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            className="form-control mb-2"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="last_seen_location"
            className="form-control mb-2"
            placeholder="Última ubicación"
            value={form.last_seen_location}
            onChange={handleChange}
          />
          <input
            name="photo"
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </div>
    </div>
);
}
