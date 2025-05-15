import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function PetForm({
  petToEdit,
  onSaved,
  addToast,
  onCancel
}) {
  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petToEdit) {
      setForm({
        name: petToEdit.name,
        breed: petToEdit.breed,
        age: petToEdit.age,
        photo: null
      });
    } else {
      setForm({ name: '', breed: '', age: '', photo: null });
    }
  }, [petToEdit]);

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
      fd.append('name', form.name);
      fd.append('breed', form.breed);
      fd.append('age', form.age);
      if (form.photo) fd.append('photo', form.photo);

      const url = petToEdit ? `/api/pets/${petToEdit.id}` : '/api/pets';
      const method = petToEdit ? 'post' : 'post';
      const { data } = await api[method](url, fd, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': petToEdit ? 'PUT' : 'POST'
        }
      });

      onSaved(data);
      addToast(
        petToEdit ? 'Mascota actualizada' : 'Mascota añadida',
        'success'
      );
      setForm({ name: '', breed: '', age: '', photo: null });
      if (petToEdit && onCancel) onCancel();
    } catch (err) {
      console.error(err);
      addToast('Error guardando la mascota', 'error');
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
          <input
            name="name"
            className="form-control mb-2"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="breed"
            className="form-control mb-2"
            placeholder="Raza"
            value={form.breed}
            onChange={handleChange}
          />
          <input
            name="age"
            type="number"
            className="form-control mb-2"
            placeholder="Edad"
            value={form.age}
            onChange={handleChange}
          />
          <input
            name="photo"
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {loading ? 'Guardando...' : petToEdit ? 'Guardar cambios' : 'Añadir mascota'}
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
