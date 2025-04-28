// PETCONNECT-FRONTEND/src/components/ActivityForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';

export default function ActivityForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    starts_at: '',
    ends_at: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return alert('El título es obligatorio');
    setLoading(true);
    try {
      const res = await api.post('/api/activities', form);
      onCreated(res.data);
      setForm({ title:'', description:'', location:'', starts_at:'', ends_at:'' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creando actividad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Proponer nueva actividad</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              name="title"
              className="form-control"
              placeholder="Título"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <input
              name="location"
              className="form-control"
              placeholder="Lugar (opcional)"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <textarea
              name="description"
              className="form-control"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <div className="col mb-2">
              <label className="form-label small">Inicio</label>
              <input
                type="datetime-local"
                name="starts_at"
                className="form-control form-control-sm"
                value={form.starts_at}
                onChange={handleChange}
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
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Proponiendo...' : 'Proponer Actividad'}
          </button>
        </form>
      </div>
    </div>
  );
}
