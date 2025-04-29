import React, { useState } from 'react';
import api from '../api/axios';

export default function ActivityForm({ addToast, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    starts_at: '',
    ends_at: ''
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
      await api.post('/api/activities', form);
      onCreated();
      setForm({
        title: '',
        location: '',
        description: '',
        starts_at: '',
        ends_at: ''
      });
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || 'Error creando actividad',
        'error'
      );
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
            placeholder="Lugar (opcional)"
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
          <div className="row">
            <div className="col mb-2">
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
            <div className="col mb-2">
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
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Proponiendo...' : 'Proponer Actividad'}
          </button>
        </form>
      </div>
    </div>
  );
}
