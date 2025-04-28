import React, { useState } from 'react';

export default function LostPetCard({ pet, onReportSighting }) {
  const [sighting, setSighting] = useState('');

  const submit = () => {
    if (!sighting.trim()) return;
    onReportSighting(pet.id, sighting);
    setSighting('');
  };

  return (
    <div className="card h-100 shadow-sm">
      <img src={pet.photo} className="card-img-top" alt={pet.name} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{pet.name}</h5>
        <p className="card-text">{pet.desc}</p>
        <div className="mt-auto">
          <h6>Avistamientos:</h6>
          {pet.sightings.map((s, i) => (
            <div key={i} className="border rounded p-2 mb-2">
              {s}
            </div>
          ))}
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Dónde lo viste..."
              value={sighting}
              onChange={e => setSighting(e.target.value)}
            />
            <button className="btn btn-sm btn-warning" onClick={submit}>
              Avisar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
