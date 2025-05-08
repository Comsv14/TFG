import React from 'react';
import StarRater from './StarRater';

export default function ActivityCard({
  activity,
  onJoin,
  onRate,            // ← nuevo callback
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

  return (
    <div className="card">
      <div className="card-body">
        {/* ── TÍTULO Y AUTOR ───────────────────────────────────── */}
        <h5 className="card-title">{title}</h5>
        <p className="text-muted small mb-2">
          Propuesta por: {user?.name || '-'}
        </p>

        {/* ── FECHAS ──────────────────────────────────────────── */}
        <p className="mb-1">
          <strong>Inicio:</strong>{' '}
          {new Date(starts_at).toLocaleString()}
        </p>
        {ends_at && (
          <p className="mb-2">
            <strong>Fin:</strong>{' '}
            {new Date(ends_at).toLocaleString()}
          </p>
        )}

        {/* ── UBICACIÓN ───────────────────────────────────────── */}
        {location && (
          <p className="mb-2">
            <strong>Lugar:</strong> {location}
          </p>
        )}

        {/* ── ASISTENTES ─────────────────────────────────────── */}
        <p className="mb-2">
          <strong>Asistentes:</strong> {participants_count}
        </p>

        {/* ── ESTRELLAS (solo cuando ha finalizado) ───────────── */}
        <div className="mb-3">
          <StarRater
            value={average_rating}
            disabled={!is_finished}
            readOnly={!is_finished}
            onRate={score => onRate?.(score)}
          />
        </div>

        {/* ── BOTÓN APUNTARSE ─────────────────────────────────── */}
        <button
          className={
            'btn ' +
            (is_registered ? 'btn-secondary disabled' : 'btn-primary')
          }
          onClick={onJoin}
          disabled={is_registered}
        >
          {is_registered ? 'Ya inscrito' : 'Apuntarse'}
        </button>
      </div>
    </div>
  );
}
