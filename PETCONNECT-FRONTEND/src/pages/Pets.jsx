// PETCONNECT-FRONTEND/src/pages/Pets.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PetCard from '../components/PetCard';
import PetForm from '../components/PetForm';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1) Al montar, traemos la lista real
  useEffect(() => {
    const fetchPets = async () => {
      try {
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

  const handleSave = petData => {
    // Se pasa res.data desde PetForm
    setPets(current =>
      petData.id
        ? current.map(p => (p.id === petData.id ? petData : p))
        : [...current, petData]
    );
    setEditing(null);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Borrar esta mascota?')) return;
    try {
      await api.delete(`/api/pets/${id}`);
      setPets(current => current.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error borrando la mascota.');
    }
  };

  if (loading) return <p>Cargando mascotas...</p>;

  return (
    <div>
      <h2 className="mb-4">Mis Mascotas</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Alta/Edición */}
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
