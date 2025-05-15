// src/pages/ReportPet.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function ReportPet({ addToast, user }) {
  const [reportType, setReportType] = useState('lost'); // 'lost' | 'found'
  const [myPets, setMyPets] = useState([]);
  const [form, setForm] = useState({
    pet_id: '',
    pet_name: '',
    description: '',
    latitude: null,
    longitude: null,
    date: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportType === 'lost') {
      loadUserPets();
    }
  }, [reportType]);

  // ✅ Cargar mascotas del usuario
  const loadUserPets = async () => {
    try {
      const { data } = await api.get('/api/pets');
      setMyPets(data);
    } catch {
      addToast('Error cargando tus mascotas', 'error');
    }
  };

  // ✅ Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value,
    }));
  };

  const handleMapChange = (lat, lng) => {
    setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
  };

  // ✅ Enviar reporte
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (reportType === 'lost' && !form.pet_id) {
      addToast('Selecciona tu mascota para reportarla como perdida.', 'error');
      return;
    }

    if (reportType === 'found' && !form.pet_name.trim()) {
      addToast('Indica el nombre o descripción de la mascota encontrada.', 'error');
      return;
    }

    if (!form.latitude || !form.longitude) {
      addToast('Debes seleccionar una ubicación en el mapa.', 'error');
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    setLoading(true);
    try {
      await api.post('/api/lost-pets', fd);
      addToast('Reporte enviado correctamente', 'success');
      setForm({
        pet_id: '',
        pet_name: '',
        description: '',
        latitude: null,
        longitude: null,
        date: '',
        photo: null,
      });
    } catch {
      addToast('Error al enviar el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Reportar Mascota {reportType === 'lost' ? 'Perdida' : 'Encontrada'}</h1>

      {/* Selector de tipo de reporte */}
      <div className="mb-3">
        <button
          className={`btn ${reportType === 'lost' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setReportType('lost')}
        >
          Reportar Mascota Perdida
        </button>
        <button
          className={`btn ms-2 ${reportType === 'found' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setReportType('found')}
        >
          Reportar Mascota Encontrada
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        {/* Reportar Perdida: Seleccionar Mascota */}
        {reportType === 'lost' ? (
          <select
            name="pet_id"
            className="form-select mb-3"
            value={form.pet_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tu mascota</option>
            {myPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="pet_name"
            className="form-control mb-3"
            placeholder="Descripción o nombre de la mascota encontrada"
            value={form.pet_name}
            onChange={handleChange}
            required
          />
        )}

        <textarea
          name="description"
          className="form-control mb-3"
          placeholder="Descripción (opcional)"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="date"
          className="form-control mb-3"
          value={form.date}
          onChange={handleChange}
          required
        />

        {/* Mapa para seleccionar ubicación */}
        <MapPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onChange={handleMapChange}
        />

        <input
          type="file"
          name="photo"
          className="form-control mt-3"
          onChange={handleChange}
        />

        <button className="btn btn-primary mt-3" type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Reporte'}
        </button>
      </form>
    </div>
  );
}
