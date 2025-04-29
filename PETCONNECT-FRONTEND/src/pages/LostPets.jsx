// PETCONNECT-FRONTEND/src/pages/LostPets.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LostPetForm from '../components/LostPetForm';
import LostPetCard from '../components/LostPetCard';

export default function LostPets({ addToast }) {
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
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las mascotas perdidas.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleReport = pet => {
    setLostList(curr => [{ ...pet, sightings: [] }, ...curr]);
    addToast('Mascota perdida reportada', 'success');
  };

  const handleSighting = async (id, sightingData) => {
    try {
      const { data } = await api.post(
        `/api/lost-pets/${id}/sightings`,
        sightingData
      );
      setLostList(curr =>
        curr.map(p =>
          p.id === id
            ? { ...p, sightings: [...p.sightings, data] }
            : p
        )
      );
      addToast('Avistamiento reportado', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error al reportar avistamiento', 'error');
    }
  };

  if (loading) return <p>Cargando mascotas perdidas...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mascotas Perdidas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <LostPetForm onReport={handleReport} addToast={addToast} />
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
