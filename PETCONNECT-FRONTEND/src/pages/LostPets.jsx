// PETCONNECT-FRONTEND/src/pages/LostPets.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LostPetForm from '../components/LostPetForm';
import LostPetCard from '../components/LostPetCard';

export default function LostPets() {
  const [lostList, setLostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1) Al montar, cargamos mascotas perdidas
  useEffect(() => {
    const fetchLost = async () => {
      try {
        const res = await api.get('/api/lost-pets');
        // cada pet ya trae -> sightings: [ { user: {name,...}, comment,... } ]
        setLostList(res.data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las mascotas perdidas.');
      } finally {
        setLoading(false);
      }
    };
    fetchLost();
  }, []);

  // 2) Reportar nueva mascota perdida
  const handleReport = async data => {
    try {
      const res = await api.post('/api/lost-pets', data);
      setLostList([res.data, ...lostList]);
    } catch (err) {
      console.error(err);
      alert('Error al reportar la mascota perdida.');
    }
  };

  // 3) Reportar avistamiento
  const handleSighting = async (id, sightingData) => {
    try {
      const res = await api.post(`/api/lost-pets/${id}/sightings`, sightingData);
      setLostList(cur =>
        cur.map(p =>
          p.id === id
            ? { ...p, sightings: [...p.sightings, res.data] }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert('Error al reportar avistamiento.');
    }
  };

  if (loading) return <p>Cargando mascotas perdidas...</p>;

  return (
    <div>
      <h2 className="mb-4">Mascotas Perdidas</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulario de reporte */}
      <LostPetForm onReport={handleReport} />

      {/* Listado */}
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
