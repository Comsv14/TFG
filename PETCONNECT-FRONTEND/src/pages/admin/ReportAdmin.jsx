import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ReportAdmin() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await api.get('/api/admin/lost-reports');
      setReports(data);
    } catch (err) {
      console.error('Error cargando reportes:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar reporte?')) return;
    try {
      await api.delete(`/api/admin/lost-reports/${id}`);
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error al eliminar reporte:', err);
    }
  };

  return (
    <div>
      <h2>Gestión de Reportes</h2>
      <ul className="list-group">
        {reports.map(r => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            {r.comment}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
