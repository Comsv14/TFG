import React, { useState } from 'react';
import api from '../api/axios';

export default function LostPetForm({ pets, addToast }) {
  const [form, setForm] = useState({
    pet_id: '',
    pet_name: '',
    description: '',
    last_seen_location: '',
    found: false,
    photo: null
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null) {
          fd.append(key, form[key]);
        }
      });

      await api.post('/api/lost-pets', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      addToast('Mascota reportada correctamente', 'success');
      setForm({
        pet_id: '',
        pet_name: '',
        description: '',
        last_seen_location: '',
        found: false,
        photo: null
      });
    } catch {
      addToast('Error al reportar la mascota', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="mb-3">
        <label className="form-label">Selecciona tu mascota</label>
        <select 
          name="pet_id" 
          className="form-select"
          value={form.pet_id}
          onChange={handleChange}
        >
          <option value="">Mascota no registrada</option>
          {pets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name}</option>
          ))}
        </select>
      </div>

      <input 
        name="pet_name" 
        className="form-control mb-3" 
        placeholder="Nombre de la mascota" 
        value={form.pet_name} 
        onChange={handleChange} 
        required 
      />

      <textarea 
        name="description" 
        className="form-control mb-3" 
        placeholder="Descripción"
        value={form.description} 
        onChange={handleChange} 
      />

      <input 
        name="last_seen_location" 
        className="form-control mb-3" 
        placeholder="Última ubicación vista"
        value={form.last_seen_location} 
        onChange={handleChange} 
      />

      <input 
        type="file" 
        name="photo" 
        accept="image/*" 
        className="form-control mb-3" 
        onChange={handleChange} 
      />

      <button className="btn btn-primary">Reportar</button>
    </form>
  );
}
