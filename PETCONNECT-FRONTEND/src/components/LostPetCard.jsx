// PETCONNECT-FRONTEND/src/components/LostPetCard.jsx
import React, { useState } from 'react';

export default function LostPetCard({ pet, onReportSighting }) {
  const [sighting, setSighting] = useState('');

  const submitSighting = () => {
    if (!sighting.trim()) return;
    onReportSighting(pet.id, { comment: sighting });
    setSighting('');
  };

  return (
    <div className="card h-100 shadow-sm">
      {pet.photo && (
        <img src={pet.photo} className="card-img-top" alt={pet.pet_name} />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{pet.pet_name}</h5>
        {pet.description && <p className="card-text">{pet.description}</p>}
        {pet.last_seen_location && (
          <p className="card-text"><small>Última ubicación: {pet.last_seen_location}</small></p>
        )}

        <div className="mt-auto">
          <h6>Avistamientos:</h6>
          {pet.sightings.map(s => (
            <div key={s.id} className="border rounded p-2 mb-2">
              <strong>{s.user.name || s.user.email}:</strong> {s.comment}
            </div>
          ))}

          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder="¿Dónde lo viste?"
              value={sighting}
              onChange={e => setSighting(e.target.value)}
            />
            <button className="btn btn-warning" onClick={submitSighting}>
              Avisar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
