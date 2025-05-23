import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function UserAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error cargando usuarios', err));
  }, []);

  return (
    <div>
      <h3>Usuarios</h3>
      <ul className="list-group">
        {users.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            {user.name} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
