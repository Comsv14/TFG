import React from 'react';

export default function ActivityCard({ activity, onJoin, onAddComment }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{activity.title}</h5>
        <p className="card-text">{activity.description}</p>
        <p className="card-text"><small>Hora: {activity.time}</small></p>
        <button
          className={`btn btn-sm mb-3 ${activity.joined ? 'btn-secondary' : 'btn-success'}`}
          disabled={activity.joined}
          onClick={() => onJoin(activity.id)}
        >
          {activity.joined ? 'Apuntado' : 'Apuntarse'}
        </button>

        {/* Comentarios */}
        <div className="mt-auto">
          <h6>Comentarios</h6>
          {activity.comments.map(c => (
            <div key={c.id} className="border rounded p-2 mb-2">
              <strong>{c.user}:</strong> {c.text}
            </div>
          ))}

          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Escribe un comentario..."
              value={activity.newComment}
              onChange={e => onAddComment(activity.id, e.target.value, true)}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onAddComment(activity.id)}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
