// src/pages/admin/ReportAdmin.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ReportAdmin() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await api.get('/api/admin/lost-reports');
    setReports(res.data);
  };

  const deleteReport = async (id) => {
    if (!window.confirm('¿Eliminar reporte?')) return;
    await api.delete(`/api/admin/lost-reports/${id}`);
    fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h3>Gestión de Reportes de Pérdida</h3>
      <table className="table">
        <thead><tr><th>Comentario</th><th>Fecha</th><th>Acciones</th></tr></thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{r.comment}</td>
              <td>{new Date(r.happened_at).toLocaleString()}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => deleteReport(r.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
