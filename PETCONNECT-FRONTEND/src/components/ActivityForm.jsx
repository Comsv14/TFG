import React, { useState } from 'react';
import api from '../api/axios';
import MapPicker from './MapPicker';

export default function ActivityForm({ addToast, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    starts_at: '',
    ends_at: '',
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      [
        'title','location','description',
        'starts_at','ends_at',
        'latitude','longitude'
      ].forEach(key => {
        if (form[key] != null) fd.append(key, form[key]);
      });

      await api.post('/api/activities', fd, {
        headers: {'Content-Type':'multipart/form-data'}
      });
      
      addToast('Actividad creada correctamente', 'success');
      onCreated();
      setForm({
        title: '',
        location: '',
        description: '',
        starts_at: '',
        ends_at: '',
        latitude: null,
        longitude: null,
      });
    } catch (err) {
      console.error(err);
      addToast('Error creando actividad', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Proponer nueva actividad</h5>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            className="form-control mb-2"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            className="form-control mb-2"
            placeholder="Lugar (texto)"
            value={form.location}
            onChange={handleChange}
          />
          <textarea
            name="description"
            className="form-control mb-2"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />

          {/* Aquí va el MapPicker */}
          <label className="form-label">Selecciona ubicación en el mapa</label>
          <MapPicker 
            latitude={form.latitude} 
            longitude={form.longitude} 
            onChange={(lat, lng) => setForm(f => ({ ...f, latitude: lat, longitude: lng }))} 
          />
          {form.latitude && form.longitude ? (
            <p className="text-muted mt-2">
              Ubicación seleccionada: {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
            </p>
          ) : (
            <p className="text-muted mt-2">Haz clic en el mapa para seleccionar la ubicación.</p>
          )}

          <div className="row g-2 mt-3">
            <div className="col">
              <label className="form-label small">Inicio</label>
              <input
                type="datetime-local"
                name="starts_at"
                className="form-control form-control-sm"
                value={form.starts_at}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label className="form-label small">Fin</label>
              <input
                type="datetime-local"
                name="ends_at"
                className="form-control form-control-sm"
                value={form.ends_at}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success mt-3"
            disabled={loading}
          >
            {loading ? 'Proponiendo...' : 'Proponer Actividad'}
          </button>
        </form>
      </div>
    </div>
  );
}
