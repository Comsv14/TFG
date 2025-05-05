import React from 'react';

export default function LostPetCard({ pet, onReportSighting, sightForm, onSightChange }) {
  return (
    <div className="card h-100">
      {pet.photo && (
        <img
          src={pet.photo}
          className="card-img-top"
          alt={pet.pet_name}
          style={{ objectFit: 'cover', height: '200px' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{pet.pet_name}</h5>
        {pet.description && <p className="card-text">{pet.description}</p>}
        {pet.last_seen_location && (
          <small className="text-muted mb-2">
            Última ubicación: {pet.last_seen_location}
          </small>
        )}

        {/* Avistamiento */}
        <div className="mt-auto">
          <form onSubmit={onReportSighting}>
            <textarea
              name="comment"
              className="form-control mb-2"
              placeholder="Comentario (opcional)"
              value={sightForm.comment || ''}
              onChange={onSightChange}
            />

            <label className="form-label">Ubicación (pincha en el mapa)</label>
            {/* Aquí podrías insertar de nuevo el MapPicker si lo deseas */}

            <div className="mb-2">
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="form-control"
                onChange={onSightChange}
              />
            </div>

            <button type="submit" className="btn btn-warning btn-sm">
              Avisar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
