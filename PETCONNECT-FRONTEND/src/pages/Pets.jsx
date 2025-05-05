import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Pets({ addToast, user }) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await api.get('/api/pets');
        setPets(res.data);
      } catch (err) {
        console.error(err);
        addToast('No se han podido cargar las mascotas','error');
      }
    }
    fetchPets();
  }, [addToast]);

  return (
    <div className="row">
      {pets.map(p => (
        <div className="col-md-4" key={p.id}>
          <div className="card mb-4">
            {p.image_url && (
              <img
                src={p.image_url}
                className="card-img-top"
                alt={p.name}
                style={{ height:200, objectFit:'cover' }}
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{p.name}</h5>
              <p className="card-text">Raza: {p.breed}</p>
              <p className="card-text">Edad: {p.age} años</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
