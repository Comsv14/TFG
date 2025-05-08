import React from 'react';
import StarRater from './StarRater';

export default function ActivityCard({
  activity,
  onJoin,
  onRate, 
}) {
  const {
    title,
    user,
    starts_at,
    ends_at,
    location,
    is_registered,
    is_finished,
    participants_count,
    average_rating,
  } = activity;

  const handleRate = (newRating) => {
    if (onRate) onRate(newRating);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="text-muted small mb-2">
          Propuesta por: {user?.name || '-'}
        </p>

        <p className="mb-1"><strong>Inicio:</strong> {new Date(starts_at).toLocaleString()}</p>
        {ends_at && <p className="mb-2"><strong>Fin:</strong> {new Date(ends_at).toLocaleString()}</p>}

        {location && <p className="mb-2"><strong>Lugar:</strong> {location}</p>}

        <p className="mb-2"><strong>Asistentes:</strong> {participants_count}</p>

        {/* ── ESTRELLAS ─────────────────────────────────────── */}
        <div className="mb-3">
          <StarRater
            activityId={activity.id}
            initialValue={average_rating}
            readOnly={!is_finished}
            onRate={handleRate}
          />
        </div>

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
