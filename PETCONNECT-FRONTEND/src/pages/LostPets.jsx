import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LostPetForm from '../components/LostPetForm';
import LostPetCard from '../components/LostPetCard';

export default function LostPets() {
  const [lostList, setLostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/lost-pets');
        setLostList(
          data.map(pet => ({
            ...pet,
            sightings: Array.isArray(pet.sightings) ? pet.sightings : []
          }))
        );
      } catch {
        setError('No se pudieron cargar las mascotas perdidas.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Aquí ya no hacemos POST, simplemente añadimos el pet que nos viene
  const handleReport = pet => {
    setLostList(prev => [{ ...pet, sightings: [] }, ...prev]);
  };

  const handleSighting = async (id, sightingData) => {
    try {
      const { data } = await api.post(`/api/lost-pets/${id}/sightings`, sightingData);
      setLostList(prev =>
        prev.map(p =>
          p.id === id ? { ...p, sightings: [...p.sightings, data] } : p
        )
      );
    } catch {
      alert('Error al reportar avistamiento.');
    }
  };

  if (loading) return <p>Cargando mascotas perdidas...</p>;

  return (
    <div>
      <h2 className="mb-4">Mascotas Perdidas</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Ahora LostPetForm es quien hace el POST y nos devuelve el pet */}
      <LostPetForm onReport={handleReport} />

      <div className="row">
        {lostList.map(pet => (
          <div className="col-md-4 mb-3" key={pet.id}>
            <LostPetCard pet={pet} onReportSighting={handleSighting} />
          </div>
        ))}
      </div>
    </div>
  );
}
