// PETCONNECT-FRONTEND/src/components/LostPetForm.jsx
import React, { useState } from 'react';

export default function LostPetForm({ onReport }) {
  const [form, setForm] = useState({
    pet_name: '',
    description: '',
    photo: '',
    last_seen_location: ''
  });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.pet_name.trim()) return alert('El nombre de la mascota es obligatorio');
    onReport(form);
    setForm({ pet_name:'', description:'', photo:'', last_seen_location:'' });
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Reportar mascota perdida</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              name="pet_name"
              className="form-control"
              placeholder="Nombre de la mascota"
              value={form.pet_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <input
              name="description"
              className="form-control"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <input
              name="photo"
              className="form-control"
              placeholder="URL foto"
              value={form.photo}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <input
              name="last_seen_location"
              className="form-control"
              placeholder="Última ubicación vista"
              value={form.last_seen_location}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-danger">
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}
