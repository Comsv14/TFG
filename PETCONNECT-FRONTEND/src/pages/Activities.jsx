import React, { useState } from 'react';
import ActivityCard from '../components/ActivityCard';

const initialActs = [
  {
    id: 1,
    title: 'Paseo Park',
    description: 'Encuentro en el parque central',
    time: '2025-05-01 10:00',
    joined: false,
    comments: [
      { id: 1, user: 'Ana', text: '¡Genial paseo!' }
    ],
    newComment: ''
  },
  {
    id: 2,
    title: 'Ruta Campo',
    description: 'Senderismo con mascotas',
    time: '2025-05-03 09:00',
    joined: true,
    comments: [],
    newComment: ''
  }
];

export default function Activities() {
  const [activities, setActivities] = useState(initialActs);

  const handleJoin = id => {
    setActivities(acts =>
      acts.map(a => a.id === id ? { ...a, joined: true } : a)
    );
  };

  const handleCommentChange = (id, text, isTyping) => {
    if (isTyping) {
      setActivities(acts =>
        acts.map(a => a.id === id ? { ...a, newComment: text } : a)
      );
    } else {
      setActivities(acts =>
        acts.map(a => {
          if (a.id !== id) return a;
          if (!a.newComment.trim()) return a;
          const next = {
            ...a,
            comments: [
              ...a.comments,
              { id: Date.now(), user: 'Tú', text: a.newComment }
            ],
            newComment: ''
          };
          return next;
        })
      );
    }
  };

  return (
    <div>
      <h2 className="mb-4">Actividades</h2>
      <div className="row">
        {activities.map(a => (
          <div className="col-md-6 mb-3" key={a.id}>
            <ActivityCard
              activity={a}
              onJoin={handleJoin}
              onAddComment={handleCommentChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
