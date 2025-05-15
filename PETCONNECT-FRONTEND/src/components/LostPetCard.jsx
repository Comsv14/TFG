import React from 'react';

export default function LostPetCard({ pet }) {
  return (
    <div className="card shadow-sm">
      {pet.photo && (
        <img 
          src={pet.photo} 
          className="card-img-top" 
          alt={pet.pet_name || 'Mascota perdida'}
          style={{ height: 200, objectFit: 'cover' }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{pet.pet_name}</h5>
        <p>{pet.description}</p>
        <p><strong>Ubicación:</strong> {pet.last_seen_location || 'Desconocida'}</p>
        <p><strong>Reportado:</strong> {new Date(pet.posted_at).toLocaleString()}</p>
        <p><strong>{pet.found ? 'Encontrada' : 'Perdida'}</strong></p>
      </div>
    </div>
  );
}
