import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function PetAdmin() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const { data } = await api.get('/api/admin/pets');
      setPets(data);
    } catch (err) {
      console.error('Error cargando mascotas:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;
    try {
      await api.delete(`/api/admin/pets/${id}`);
      setPets(pets.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <div>
      <h2>Gestión de Mascotas</h2>
      <ul className="list-group">
        {pets.map(pet => (
          <li key={pet.id} className="list-group-item d-flex justify-content-between align-items-center">
            {pet.name} ({pet.breed || 'sin raza'})
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pet.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
