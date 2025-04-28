import React, { useState } from 'react';

export default function LostPetForm({ onReport }) {
  const [form, setForm] = useState({ name: '', desc: '', photo: '' });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name) return alert('Pon nombre');
    onReport({ ...form, id: Date.now(), sightings: [] });
    setForm({ name: '', desc: '', photo: '' });
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Reportar mascota perdida</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              className="form-control form-control-sm"
              placeholder="Nombre de la mascota"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <input
              className="form-control form-control-sm"
              placeholder="Descripción"
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <input
              className="form-control form-control-sm"
              placeholder="URL foto"
              value={form.photo}
              onChange={e => setForm({ ...form, photo: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-danger btn-sm">
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}
