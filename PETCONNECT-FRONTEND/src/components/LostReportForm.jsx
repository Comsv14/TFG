// src/components/LostReportForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import MapPicker from './MapPicker';

export default function LostReportForm({ addToast, onReport }) {
  const [form, setForm] = useState({
    type: 'lost',  // 'lost' para mascotas perdidas, 'found' para mascotas encontradas
    pet_id: '',
    comment: '',
    happened_at: '',
    latitude: '',
    longitude: '',
    photo: null
  });

  const [myPets, setMyPets] = useState([]);

  // Cargar mascotas del usuario
  const loadMyPets = async () => {
    try {
      const { data } = await api.get('/api/pets');
      setMyPets(data);
    } catch {
      addToast('Error cargando tus mascotas', 'error');
    }
  };

  useState(() => {
    loadMyPets();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value,
    }));
  };

  const handleMapChange = (lat, lng) => {
    setForm((f) => ({
      ...f,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    try {
      await api.post('/api/lost-reports', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      addToast(`Reporte de mascota ${form.type === 'lost' ? 'perdida' : 'encontrada'} enviado`, 'success');
      onReport();
      setForm({
        type: 'lost',
        pet_id: '',
        comment: '',
        happened_at: '',
        latitude: '',
        longitude: '',
        photo: null
      });
    } catch {
      addToast('Error al enviar el reporte', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h5 className="card-title">Reportar Mascota Perdida o Encontrada</h5>
      
      {/* Tipo de reporte */}
      <div className="mb-3">
        <label className="form-label">Tipo de Reporte</label>
        <select 
          name="type" 
          className="form-select" 
          value={form.type} 
          onChange={handleChange}
        >
          <option value="lost">Mascota Perdida</option>
          <option value="found">Mascota Encontrada</option>
        </select>
      </div>

      {/* Selección de mascota (solo para perdidas) */}
      {form.type === 'lost' && (
        <div className="mb-3">
          <label className="form-label">Selecciona tu Mascota</label>
          <select 
            name="pet_id" 
            className="form-select" 
            value={form.pet_id} 
            onChange={handleChange}
          >
            <option value="">Selecciona...</option>
            {myPets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Comentario */}
      <textarea 
        name="comment" 
        className="form-control mb-3" 
        placeholder="Comentario" 
        value={form.comment} 
        onChange={handleChange} 
        required 
      />

      {/* Fecha y hora */}
      <input 
        type="datetime-local" 
        name="happened_at" 
        className="form-control mb-3" 
        value={form.happened_at} 
        onChange={handleChange} 
        required 
      />

      {/* Mapa para seleccionar ubicación */}
      <label className="form-label">Selecciona Ubicación</label>
      <MapPicker 
        latitude={form.latitude} 
        longitude={form.longitude} 
        onChange={handleMapChange} 
      />

      {/* Foto opcional */}
      <div className="mt-3">
        <label className="form-label">Foto (opcional)</label>
        <input 
          type="file" 
          name="photo" 
          accept="image/*" 
          className="form-control" 
          onChange={handleChange} 
        />
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        {form.type === 'lost' ? 'Reportar Perdida' : 'Reportar Mascota Encontrada'}
      </button>
    </form>
  );
}
