// src/pages/admin/StatsAdmin.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function StatsAdmin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/api/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  if (!stats) return <p>Cargando estadísticas...</p>;

  return (
    <div>
      <h2>Estadísticas del Sistema</h2>
      <ul className="list-group">
        <li className="list-group-item">Usuarios registrados: <strong>{stats.users}</strong></li>
        <li className="list-group-item">Mascotas registradas: <strong>{stats.pets}</strong></li>
        <li className="list-group-item">Actividades creadas: <strong>{stats.activities}</strong></li>
        <li className="list-group-item">Comentarios en actividades: <strong>{stats.comments_activity}</strong></li>
        <li className="list-group-item">Comentarios en reportes de pérdida: <strong>{stats.comments_lost_reports}</strong></li>
        <li className="list-group-item">Comentarios totales: <strong>{stats.comments_total}</strong></li>
        <li className="list-group-item">Reportes de pérdida: <strong>{stats.lostReports}</strong></li>
      </ul>
    </div>
  );
}
