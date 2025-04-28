// src/components/PetCard.jsx
import React from 'react';

export default function PetCard({ pet, onEdit, onDelete }) {
  return (
    <div className="card h-100 shadow-sm">
      {pet.photo && (
        <img src={pet.photo} className="card-img-top" alt={pet.name} />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{pet.name}</h5>
        <p className="card-text mb-1">Raza: {pet.breed}</p>
        <p className="card-text mb-3">Edad: {pet.age} años</p>
        <div className="mt-auto d-flex justify-content-between">
          <button className="btn btn-sm btn-outline-primary" onClick={onEdit}>
            Editar
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
