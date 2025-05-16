import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Notifications({ user, addToast }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
    } catch {
      addToast('Error al cargar notificaciones', 'error');
    }
  };

  const markAsRead = async (id) => {
    await api.post('/api/notifications/mark-as-read', { notification_id: id });
    loadNotifications();
  };

  return (
    <div>
      <h1>Notificaciones</h1>
      {notifications.length === 0 ? (
        <p>No tienes notificaciones</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              <strong>{n.title}</strong> - {n.message}
              {!n.read && (
                <button onClick={() => markAsRead(n.id)}>Marcar como leída</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
