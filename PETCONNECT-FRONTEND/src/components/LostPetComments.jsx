import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function LostPetComments({ lostReportId, addToast }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/lost-reports/${lostReportId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      addToast('Error al cargar comentarios', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await api.post(`/api/lost-reports/${lostReportId}/comments`, { body: newComment });
      setNewComment('');
      addToast('Comentario publicado', 'success');
      await fetchComments();
    } catch (err) {
      console.error(err);
      addToast('Error al enviar comentario', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [lostReportId]);

  return (
    <div className="mt-4">
      <h5>Comentarios</h5>
      <form onSubmit={handleSubmit} className="mb-3">
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Escribe tu comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Publicando…' : 'Publicar'}
        </button>
      </form>

      <ul className="list-group">
        {comments.map((comment) => (
          <li className="list-group-item" key={comment.id}>
            <strong>{comment.user?.name}:</strong> {comment.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
