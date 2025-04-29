// PETCONNECT-FRONTEND/src/pages/Pets.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PetForm from '../components/PetForm';
import PetCard from '../components/PetCard';

export default function Pets({ addToast }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data } = await api.get('/api/pets');
        setPets(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las mascotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleSave = pet => {
    setPets(curr => {
      const exists = curr.some(p => p.id === pet.id);
      if (exists) {
        return curr.map(p => (p.id === pet.id ? pet : p));
      }
      return [pet, ...curr];
    });
    addToast('Mascota guardada con éxito', 'success');
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que quieres borrar esta mascota?')) return;
    try {
      await api.delete(`/api/pets/${id}`);
      setPets(curr => curr.filter(p => p.id !== id));
      addToast('Mascota eliminada con éxito', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error al borrar la mascota', 'error');
    }
  };

  if (loading) return <p>Cargando mascotas...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Mascotas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <PetForm onSaved={handleSave} addToast={addToast} />
      <div className="row">
        {pets.map(pet => (
          <div className="col-md-4 mb-3" key={pet.id}>
            <PetCard pet={pet} onDelete={handleDelete} onEdit={handleSave} />
          </div>
        ))}
      </div>
    </div>
  );
}
