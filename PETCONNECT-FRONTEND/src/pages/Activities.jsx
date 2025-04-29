// PETCONNECT-FRONTEND/src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ActivityForm from '../components/ActivityForm';
import ActivityCard from '../components/ActivityCard';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar actividades + comentarios
  const loadActivities = async () => {
    try {
      // 1) Traemos todas las actividades
      const { data: acts } = await api.get('/api/activities');
      // 2) Inicializamos comentarios y joined
      const initialized = acts.map(a => ({
        ...a,
        joined: a.users?.some(u => u.id === a.id) ?? false,
        comments: [],
        newComment: ''
      }));
      setActivities(initialized);

      // 3) Para cada actividad, traemos sus comentarios
      await Promise.all(
        initialized.map(async a => {
          const { data: c } = await api.get('/api/comments', {
            params: { activity_id: a.id }
          });
          setActivities(curr =>
            curr.map(x =>
              x.id === a.id ? { ...x, comments: c } : x
            )
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

  // Al montar, cargamos
  useEffect(() => {
    loadActivities();
  }, []);

  // Cuando creamos, recargamos
  const handleCreate = () => {
    setLoading(true);
    loadActivities();
  };

  // Apuntarse...
  const handleJoin = async id => {
    try {
      await api.post(`/api/activities/${id}/register`);
      loadActivities();
    } catch (err) {
      console.error(err);
      alert('Error al apuntarse.');
    }
  };

  // Gestión comentarios...
  const handleCommentChange = (id, text) => {
    setActivities(curr =>
      curr.map(a => (a.id === id ? { ...a, newComment: text } : a))
    );
  };

  const handleCommentSubmit = async id => {
    const act = activities.find(a => a.id === id);
    if (!act.newComment.trim()) return;
    try {
      await api.post('/api/comments', {
        activity_id: id,
        body: act.newComment
      });
      loadActivities();
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

      {/* Proponer */}
      <ActivityForm onCreated={handleCreate} />

      {/* Listado */}
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
