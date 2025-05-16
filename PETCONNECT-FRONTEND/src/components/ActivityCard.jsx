// src/components/ActivityCard.jsx
import React, { useState, useEffect } from 'react';
import ActivityMap from './ActivityMap';
import StarRater from './StarRater';

export default function ActivityCard({
  activity,
  onJoin,
  onRate,
  addToast
}) {
  const {
    title,
    user,
    starts_at,
    ends_at,
    location,
    is_registered,
    is_finished,
    participants_count = 0,
    average_rating = 0,
    latitude,
    longitude,
    description
  } = activity;

  // ✅ Control Local para Promedio y Participantes
  const [localAverage, setLocalAverage] = useState(Number(average_rating) || 0);
  const [localCount, setLocalCount] = useState(Number(participants_count) || 0);

  useEffect(() => {
    setLocalAverage(Number(average_rating) || 0);
    setLocalCount(Number(participants_count) || 0);
  }, [average_rating, participants_count]);

  const handleRate = async (newRating) => {
    if (onRate) {
      await onRate(newRating);
      
      // ✅ Actualizamos el promedio y los participantes localmente
      setLocalAverage((prevAverage) => {
        const total = prevAverage * localCount + newRating;
        const newAverage = localCount > 0 ? total / (localCount + 1) : newRating;
        setLocalCount((prevCount) => prevCount + 1);
        return Number(newAverage.toFixed(2));
      });
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="text-muted small mb-2">Propuesta por: {user?.name || '-'}</p>
        {description && <p className="card-text">{description}</p>}
        <p><strong>Inicio:</strong> {new Date(starts_at).toLocaleString()}</p>
        {ends_at && <p><strong>Fin:</strong> {new Date(ends_at).toLocaleString()}</p>}
        {location && <p><strong>Lugar:</strong> {location}</p>}

        {/* Mapa de Actividad */}
        {latitude && longitude && (
          <div className="mb-3">
            <ActivityMap latitude={latitude} longitude={longitude} />
          </div>
        )}

        <p className="mb-2"><strong>Asistentes:</strong> {localCount}</p>

        {/* Estrellas y Promedio */}
        <div className="d-flex align-items-center mb-3">
          <StarRater
            activityId={activity.id}
            initialValue={localAverage}
            readOnly={!is_finished}
            onRate={handleRate}
          />
          <span className="ms-2">Promedio: {localAverage.toFixed(2)} ★</span>
        </div>

        {/* Botón de Inscripción */}
        <button
          className={'btn ' + (is_registered ? 'btn-secondary disabled' : 'btn-primary')}
          onClick={onJoin}
          disabled={is_registered}
        >
          {is_registered ? 'Ya inscrito' : 'Apuntarse'}
        </button>
      </div>
    </div>
  );
}
