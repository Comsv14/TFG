// PETCONNECT-FRONTEND/src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ActivityForm from '../components/ActivityForm';
import ActivityCard from '../components/ActivityCard';

export default function Activities({ addToast }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActivities = async () => {
    try {
      const { data: acts } = await api.get('/api/activities');
      const initialized = acts.map(a => ({
        ...a,
        joined: false,
        comments: [],
        newComment: ''
      }));
      setActivities(initialized);
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
      setError('No se pudieron cargar las actividades');
      addToast('Error al cargar actividades', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleCreate = () => {
    loadActivities();
    addToast('Actividad creada con éxito', 'success');
  };

  const handleJoin = async id => {
    try {
      await api.post(`/api/activities/${id}/register`);
      loadActivities();
      addToast('Apuntado a la actividad', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error al apuntarse', 'error');
    }
  };

  const handleCommentChange = (id, text) => {
    setActivities(curr =>
      curr.map(a =>
        a.id === id ? { ...a, newComment: text } : a
      )
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
      addToast('Comentario añadido', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error al enviar comentario', 'error');
    }
  };

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Actividades Colectivas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ActivityForm
        onCreated={handleCreate}
        addToast={addToast}
      />
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
