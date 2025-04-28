// PETCONNECT-FRONTEND/src/components/ActivityCard.jsx
import React from 'react';

export default function ActivityCard({
  activity,
  onJoin,
  onCommentChange,
  onCommentSubmit
}) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{activity.title}</h5>
        <p className="card-text">{activity.description}</p>
        {activity.location && <p className="card-text"><small>Lugar: {activity.location}</small></p>}
        {activity.starts_at && <p className="card-text"><small>Inicio: {new Date(activity.starts_at).toLocaleString()}</small></p>}
        <button
          className={`btn btn-sm mb-3 ${activity.joined ? 'btn-secondary' : 'btn-success'}`}
          disabled={activity.joined}
          onClick={() => onJoin(activity.id)}
        >
          {activity.joined ? 'Apuntado' : 'Apuntarse'}
        </button>

        <div className="mt-auto">
          <h6>Comentarios</h6>
          {activity.comments.map(c => (
            <div key={c.id} className="border rounded p-2 mb-2">
              <strong>{c.user.name || c.user.email}:</strong> {c.body}
            </div>
          ))}
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe un comentario..."
              value={activity.newComment}
              onChange={e => onCommentChange(activity.id, e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => onCommentSubmit(activity.id)}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
