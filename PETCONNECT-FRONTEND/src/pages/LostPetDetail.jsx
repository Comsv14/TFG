import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function LostPetDetail({ addToast }) {
  const { id } = useParams();
  const [lost, setLost] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/lost-pets/${id}`);
        setLost(res.data.data ?? res.data);
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
          <h3 className="card-title">{lost.pet.name}</h3>
          <p className="card-text">
            <strong>Raza:</strong> {lost.pet.breed} <br />
            <strong>Edad:</strong> {lost.pet.age} años<br />
            <strong>Ubicación:</strong> {lost.location ?? '—'} <br />
            <strong>Comentario:</strong> {lost.comment ?? '—'} <br />
            <strong>Reportado:</strong> {lost.posted_at}
          </p>
        </div>
      </div>
    </div>
  );
}
