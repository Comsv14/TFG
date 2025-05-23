// src/pages/admin/ActivityAdmin.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ActivityAdmin() {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    const res = await api.get('/api/admin/activities');
    setActivities(res.data);
  };

  const deleteActivity = async (id) => {
    if (!window.confirm('¿Eliminar actividad?')) return;
    await api.delete(`/api/admin/activities/${id}`);
    fetchActivities();
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div>
      <h3>Gestión de Actividades</h3>
      <table className="table">
        <thead><tr><th>Título</th><th>Fecha</th><th>Acciones</th></tr></thead>
        <tbody>
          {activities.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{new Date(a.date).toLocaleString()}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => deleteActivity(a.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
