// src/pages/admin/StatsAdmin.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function StatsAdmin() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    (async () => {
      const res = await api.get('/api/admin/stats');
      setStats(res.data);
    })();
  }, []);

  return (
    <div>
      <h3>Estadísticas del Sistema</h3>
      <ul className="list-group">
        <li className="list-group-item">Usuarios registrados: {stats.users}</li>
        <li className="list-group-item">Mascotas registradas: {stats.pets}</li>
        <li className="list-group-item">Actividades creadas: {stats.activities}</li>
        <li className="list-group-item">Reportes de pérdida: {stats.reports}</li>
        <li className="list-group-item">Comentarios: {stats.comments}</li>
      </ul>
    </div>
  );
}
