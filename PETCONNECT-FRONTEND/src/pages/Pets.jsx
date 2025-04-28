// PETCONNECT-FRONTEND/src/pages/Pets.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PetCard from '../components/PetCard';
import PetForm from '../components/PetForm';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Carga inicial
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/pets');
        setPets(res.data);
      } catch (err) {
        console.error(err);
        alert('Error cargando mascotas');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaved = pet => {
    // Si viene con id que ya existía, reemplaza
    if (editing) {
      setPets(pets.map(p => (p.id === pet.id ? pet : p)));
      setEditing(null);
    } else {
      // Nueva mascota la añade al array
      setPets([pet, ...pets]);
    }
  };

  const handleEdit = pet => {
    setEditing(pet);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleDelete = async pet => {
    if (!window.confirm(`¿Eliminar a ${pet.name}?`)) return;
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.delete(`/api/pets/${pet.id}`);
      setPets(pets.filter(p => p.id !== pet.id));
    } catch (err) {
      console.error(err);
      alert('Error eliminando mascota');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Mis Mascotas</h2>

      <PetForm
        onSaved={handleSaved}
        petToEdit={editing}
        onCancel={handleCancel}
      />

      {loading ? (
        <p>Cargando mascotas…</p>
      ) : pets.length === 0 ? (
        <p>No tienes mascotas registradas.</p>
      ) : (
        <div className="row">
          {pets.map(pet => (
            <div className="col-md-4 mb-3" key={pet.id}>
              <PetCard
                pet={pet}
                onEdit={() => handleEdit(pet)}
                onDelete={() => handleDelete(pet)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
