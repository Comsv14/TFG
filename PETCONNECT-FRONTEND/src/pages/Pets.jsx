// src/pages/Pets.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PetCard from '../components/PetCard';
import PetForm from '../components/PetForm';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1) Al montar, obtenemos lista de mascotas
  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Asegura la cookie CSRF
        await api.get('/sanctum/csrf-cookie');
        // Trae las mascotas
        const res = await api.get('/api/pets');
        setPets(res.data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las mascotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleSave = async petData => {
    try {
      let res;
      if (petData.id) {
        // Editar
        res = await api.put(`/api/pets/${petData.id}`, petData);
        setPets(pets.map(p => (p.id === petData.id ? res.data : p)));
        setEditing(null);
      } else {
        // Crear
        res = await api.post('/api/pets', petData);
        setPets([...pets, res.data]);
      }
    } catch (err) {
      console.error(err);
      alert('Error guardando la mascota.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que quieres borrar esta mascota?')) return;
    try {
      await api.delete(`/api/pets/${id}`);
      setPets(pets.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error borrando la mascota.');
    }
  };

  if (loading) {
    return <p>Cargando mascotas...</p>;
  }

  return (
    <div>
      <h2 className="mb-4">Mis Mascotas</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulario de alta/edición */}
      <PetForm
        petToEdit={editing}
        onSaved={handleSave}
        onCancel={() => setEditing(null)}
      />

      {/* Listado */}
      <div className="row">
        {pets.map(pet => (
          <div className="col-md-4 mb-3" key={pet.id}>
            <PetCard
              pet={pet}
              onEdit={() => setEditing(pet)}
              onDelete={() => handleDelete(pet.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
