// PETCONNECT-FRONTEND/src/components/PetForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function PetForm({ onSaved, petToEdit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petToEdit) {
      setForm({
        name: petToEdit.name,
        breed: petToEdit.breed,
        age: petToEdit.age,
        photo: petToEdit.photo
      });
    } else {
      setForm({ name: '', breed: '', age: '', photo: '' });
    }
  }, [petToEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(old => ({ ...old, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) return alert('El nombre es obligatorio');
    setLoading(true);
    try {
      let res;
      if (petToEdit?.id) {
        // Editar
        res = await api.put(`/api/pets/${petToEdit.id}`, form);
      } else {
        // Crear
        res = await api.post('/api/pets', form);
      }
      onSaved(res.data);
      setForm({ name: '', breed: '', age: '', photo: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error guardando la mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {petToEdit ? 'Editar Mascota' : 'Nueva Mascota'}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              name="name"
              className="form-control"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <input
              name="breed"
              className="form-control"
              placeholder="Raza"
              value={form.breed}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <input
              name="age"
              type="number"
              className="form-control"
              placeholder="Edad"
              value={form.age}
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
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={loading}
          >
            {loading
              ? petToEdit
                ? 'Guardando...'
                : 'Añadiendo...'
              : petToEdit
              ? 'Guardar cambios'
              : 'Añadir mascota'}
          </button>
          {petToEdit && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
