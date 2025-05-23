import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ActivityAdmin() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data } = await api.get('/api/admin/activities');
      setActivities(data);
    } catch (err) {
      console.error('Error cargando actividades:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar actividad?')) return;
    try {
      await api.delete(`/api/admin/activities/${id}`);
      setActivities(activities.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <div>
      <h2>Gestión de Actividades</h2>
      <ul className="list-group">
        {activities.map(a => (
          <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
            {a.title}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
