import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function CommentAdmin() {
  const [activityComments, setActivityComments] = useState([]);
  const [lostPetComments, setLostPetComments] = useState([]);
  const [lostReportComments, setLostReportComments] = useState([]);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const { data } = await api.get('/api/admin/comments');
      setActivityComments(data.activityComments);
      setLostPetComments(data.lostPetComments);
      setLostReportComments(data.lostReportComments);
    } catch (err) {
      console.error('Error cargando comentarios:', err);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('¿Eliminar comentario?')) return;
    try {
      await api.delete(`/api/admin/comments/${id}?type=${type}`);
      loadComments();
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
    }
  };

  const renderList = (title, items, type) => (
    <>
      <h4 className="mt-4">{title}</h4>
      <ul className="list-group">
        {items.length === 0 ? (
          <li className="list-group-item text-muted">Sin comentarios</li>
        ) : (
          items.map(c => (
            <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{c.user?.name || 'Desconocido'}:</strong> {c.body}
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id, type)}>Eliminar</button>
            </li>
          ))
        )}
      </ul>
    </>
  );

  return (
    <div>
      <h2>Gestión de Comentarios</h2>
      {renderList('Comentarios de Actividades', activityComments, 'activity')}
      {renderList('Comentarios de Mascotas Perdidas', lostPetComments, 'lost_pet')}
      {renderList('Comentarios de Reportes de Pérdida', lostReportComments, 'lost_report')}
    </div>
  );
}
