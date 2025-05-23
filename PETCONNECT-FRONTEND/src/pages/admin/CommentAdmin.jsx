// src/pages/admin/CommentAdmin.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function CommentAdmin() {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await api.get('/api/admin/comments');
    setComments(res.data);
  };

  const deleteComment = async (id) => {
    if (!window.confirm('¿Eliminar comentario?')) return;
    await api.delete(`/api/admin/comments/${id}`);
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <h3>Gestión de Comentarios</h3>
      <ul className="list-group">
        {comments.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{c.content}</span>
            <button className="btn btn-sm btn-danger" onClick={() => deleteComment(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
