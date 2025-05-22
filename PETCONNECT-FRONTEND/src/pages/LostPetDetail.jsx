import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LostPetComments from '../components/LostPetComments';

export default function LostPetDetail({ addToast }) {
  const { id } = useParams();
  const [lost, setLost] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/lost-pets/${id}`);
        setLost(res.data);
      } catch {
        addToast('No se pudo cargar el reporte', 'error');
      }
    })();
  }, [id, addToast]);

  if (!lost) return null;

  return (
    <div>
      <Link to="/lost-pets" className="btn btn-link mb-3">
        ← Volver
      </Link>

      <div className="card mb-4">
        {lost.photo && (
          <img
            src={lost.photo}
            alt="reporte"
            className="card-img-top"
            style={{ maxHeight: 300, objectFit: 'cover' }}
          />
        )}
        <div className="card-body">
          <h3 className="card-title">{lost.pet_name ?? 'Mascota'}</h3>
          <p className="card-text">
            <strong>Descripción:</strong> {lost.description ?? '—'}<br />
            <strong>Ubicación:</strong> {lost.last_seen_location ?? '—'}<br />
            <strong>Fecha:</strong> {lost.posted_at}
          </p>
        </div>
      </div>

      {/* Comentarios de la mascota perdida */}
      <LostPetComments lostReportId={id} addToast={addToast} />
    </div>
  );
}
