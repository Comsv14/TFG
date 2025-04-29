import React from 'react';

export default function ActivityCard({ activity, onJoin }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{activity.title}</h5>
        <p className="text-muted small mb-2">
          Propuesta por: {activity.user?.name || '-'}
        </p>
        <p className="mb-1">
          <strong>Inicio:</strong>{' '}
          {new Date(activity.starts_at).toLocaleString()}
        </p>
        {activity.ends_at && (
          <p className="mb-2">
            <strong>Fin:</strong>{' '}
            {new Date(activity.ends_at).toLocaleString()}
          </p>
        )}
        {activity.location && (
          <p className="mb-3">
            <strong>Lugar:</strong> {activity.location}
          </p>
        )}

        <button
          className={
            'btn ' +
            (activity.is_registered
              ? 'btn-secondary disabled'
              : 'btn-primary')
          }
          onClick={onJoin}
          disabled={activity.is_registered}
        >
          {activity.is_registered ? 'Ya inscrito' : 'Apuntarse'}
        </button>
      </div>
    </div>
  );
}
