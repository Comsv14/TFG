// src/components/ActivityCard.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ActivityCard({ activity, onJoin, onRate, addToast }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const loadComments = async () => {
    try {
      const res = await api.get(`/api/activities/${activity.id}/comments`);
      setComments(res.data);
    } catch {
      addToast('Error al cargar comentarios', 'error');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/api/activities/${activity.id}/comments`, {
        body: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch {
      addToast('Error al enviar comentario', 'error');
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <div className="card p-3">
      <h5>{activity.title}</h5>
      <p>{activity.description}</p>
      <p>
        <strong>Ubicación:</strong> {activity.location}
      </p>
      <p>
        <strong>Fecha:</strong> {new Date(activity.starts_at).toLocaleString()}
      </p>

      {!activity.is_finished && (
        <button onClick={onJoin} className="btn btn-outline-primary btn-sm me-2">
          Inscribirse
        </button>
      )}

      {activity.is_finished && (
        <div className="mt-2">
          <strong>Valorar:</strong>{' '}
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => onRate(val)}
              className="btn btn-sm btn-warning me-1"
            >
              {val} ⭐
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h6>Comentarios</h6>
        <form onSubmit={handleCommentSubmit}>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe un comentario…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Enviar</button>
          </div>
        </form>

        {comments.length > 0 ? (
          <ul className="list-group">
            {comments.map((c) => (
              <li key={c.id} className="list-group-item">
                <strong>{c.user.name}:</strong> {c.body}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Sin comentarios todavía.</p>
        )}
      </div>
    </div>
  );
}
