// src/pages/admin/PetAdmin.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function PetAdmin() {
  const [pets, setPets] = useState([]);

  const fetchPets = async () => {
    try {
      const res = await api.get('/api/admin/pets');
      setPets(res.data);
    } catch (e) {
      console.error('Error al cargar mascotas:', e);
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm('¿Eliminar esta mascota?')) return;
    await api.delete(`/api/admin/pets/${id}`);
    fetchPets();
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div>
      <h3>Gestión de Mascotas</h3>
      <table className="table">
        <thead><tr><th>Nombre</th><th>Raza</th><th>Edad</th><th>Acciones</th></tr></thead>
        <tbody>
          {pets.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.breed}</td>
              <td>{p.age}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => deletePet(p.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
