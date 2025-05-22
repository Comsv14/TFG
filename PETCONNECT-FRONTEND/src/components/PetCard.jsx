import React, { useState } from 'react';
import api from '../api/axios';

export default function PetCard({ pet, onEdit, onDelete }) {
  const [isWalking, setIsWalking] = useState(pet.is_walking);
  const [loading, setLoading] = useState(false);

  const toggleWalk = async () => {
    try {
      setLoading(true);
      await api.patch(`/api/pets/${pet.id}/toggle-walk`);
      setIsWalking(prev => !prev);
    } catch (err) {
      console.error(err);
      alert('Error al cambiar el estado de paseo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      {pet.photo_url && (
        <img src={pet.photo_url} className="card-img-top" alt={pet.name} />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{pet.name}</h5>
        <p className="card-text mb-1">Raza: {pet.breed}</p>
        <p className="card-text mb-1">Edad: {pet.age} años</p>
        <p className="card-text mb-3">
          Estado: <strong>{isWalking ? 'De paseo' : 'En casa'}</strong>
        </p>

        <div className="d-grid gap-2 mb-2">
          <button
            className={`btn btn-sm ${isWalking ? 'btn-warning' : 'btn-success'}`}
            onClick={toggleWalk}
            disabled={loading}
          >
            {loading
              ? 'Actualizando...'
              : isWalking
              ? 'Marcar como en casa'
              : 'Marcar como de paseo'}
          </button>
        </div>

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
