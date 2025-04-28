// PETCONNECT-FRONTEND/src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ActivityForm from '../components/ActivityForm';
import ActivityCard from '../components/ActivityCard';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1) Carga inicial de actividades y comentarios
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: acts } = await api.get('/api/activities');
        // Inicializamos newComment y comments
        const init = acts.map(a => ({ ...a, newComment: '', comments: [] }));
        setActivities(init);

        // Cargar comentarios de cada actividad
        await Promise.all(
          init.map(async a => {
            const { data: c } = await api.get('/api/comments', {
              params: { activity_id: a.id }
            });
            setActivities(curr =>
              curr.map(x => (x.id === a.id ? { ...x, comments: c } : x))
            );
          })
        );
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las actividades.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 2) Añadir nueva actividad propuesta
  const handleCreate = activity => {
    setActivities(curr => [ { ...activity, joined: false, newComment:'', comments: [] }, ...curr ]);
  };

  // 3) Apuntarse
  const handleJoin = async id => {
    try {
      await api.post(`/api/activities/${id}/register`);
      setActivities(curr =>
        curr.map(a => (a.id === id ? { ...a, joined: true } : a))
      );
    } catch (err) {
      console.error(err);
      alert('Error al apuntarse.');
    }
  };

  // 4) Cambio de texto en comentario
  const handleCommentChange = (id, text) => {
    setActivities(curr =>
      curr.map(a => (a.id === id ? { ...a, newComment: text } : a))
    );
  };

  // 5) Enviar comentario
  const handleCommentSubmit = async id => {
    const act = activities.find(a => a.id === id);
    if (!act.newComment.trim()) return;
    try {
      const { data: comment } = await api.post('/api/comments', {
        activity_id: id,
        body: act.newComment
      });
      setActivities(curr =>
        curr.map(a =>
          a.id === id
            ? { ...a, comments: [...a.comments, comment], newComment: '' }
            : a
        )
      );
    } catch (err) {
      console.error(err);
      alert('Error al enviar comentario.');
    }
  };

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div>
      <h2 className="mb-4">Actividades Colectivas</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulario de propuesta */}
      <ActivityForm onCreated={handleCreate} />

      {/* Listado de actividades */}
      <div className="row">
        {activities.map(act => (
          <div className="col-md-6 mb-3" key={act.id}>
            <ActivityCard
              activity={act}
              onJoin={handleJoin}
              onCommentChange={handleCommentChange}
              onCommentSubmit={handleCommentSubmit}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
