import React, { useState } from 'react';
import LostPetForm from '../components/LostPetForm';
import LostPetCard from '../components/LostPetCard';

const initialLost = [
  {
    id: 1,
    name: 'Oreo',
    desc: 'Negro y blanco, visto por última vez en calle A',
    photo: 'https://via.placeholder.com/150',
    sightings: ['Lo vi cerca del bar El Parque']
  }
];

export default function LostPets() {
  const [lostList, setLostList] = useState(initialLost);

  const handleReport = pet => {
    setLostList([pet, ...lostList]);
  };

  const handleSighting = (id, text) => {
    setLostList(list =>
      list.map(p =>
        p.id === id
          ? { ...p, sightings: [text, ...p.sightings] }
          : p
      )
    );
  };

  return (
    <div>
      <h2 className="mb-4">Mascotas Perdidas</h2>
      {/* Formulario de nuevo reporte */}
      <LostPetForm onReport={handleReport} />

      {/* Listado de mascotas perdidas */}
      <div className="row">
        {lostList.map(p => (
          <div className="col-md-4 mb-3" key={p.id}>
            <LostPetCard pet={p} onReportSighting={handleSighting} />
          </div>
        ))}
      </div>
    </div>
  );
}
