// src/pages/LostReports.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function LostReports({ addToast, user }) {
  const [lostReports, setLostReports] = useState([]);
  const [myPets,      setMyPets]      = useState([]);
  const [mode,        setMode]        = useState('lost');
  const [form,        setForm]        = useState({
    pet_id: '',
    comment: '',
    happened_at: '',
    latitude: null,
    longitude: null,
    photo: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const [petsRes, reportsRes] = await Promise.all([
          api.get('/api/pets'),
          api.get('/api/lost-pets')
        ]);
        setMyPets(petsRes.data);
        setLostReports(reportsRes.data);
      } catch (e) {
        addToast('Error cargando datos', 'error');
      }
    })();
  }, [addToast]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm(f => ({ ...f, photo: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleMap(lat, lng) {
    setForm(f => ({ ...f, latitude: lat, longitude: lng }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (mode === 'lost') {
        fd.append('pet_name', form.pet_id); // o `pet_id` si cambias API
        fd.append('comment', form.comment);
        fd.append('happened_at', form.happened_at);
        fd.append('longitude', form.longitude);
        fd.append('latitude',  form.latitude);
        if (form.photo) fd.append('photo', form.photo);
      } else {
        // …
      }

      const res = await api.post('/api/lost-pets', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setLostReports([res.data, ...lostReports]);
      addToast('Enviado con éxito', 'success');
      setForm({
        pet_id: '', comment: '', happened_at: '',
        latitude: null, longitude: null, photo: null
      });
    } catch {
      addToast('Error al enviar', 'error');
    }
  }

  return (
    <div>
      <h1>Reportar Mascota Perdida</h1>
      <form onSubmit={handleSubmit} className="card p-4 mb-5">
        <select
          name="pet_id"
          className="form-select mb-3"
          required value={form.pet_id}
          onChange={handleChange}
        >
          <option value="">Selecciona tu mascota</option>
          {myPets.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <textarea
          name="comment"
          className="form-control mb-3"
          placeholder="Comentario"
          value={form.comment}
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          name="happened_at"
          className="form-control mb-3"
          value={form.happened_at}
          onChange={handleChange}
          required
        />

        <label className="form-label">Ubicación (pincha en el mapa)</label>
        <MapPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onChange={handleMap}
        />

        <div className="mt-3 mb-3">
          <label className="form-label">Foto (opcional)</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-danger">Reportar Pérdida</button>
      </form>

      <h2>Listado de Pérdidas</h2>
      {lostReports.map(r => (
        <div key={r.id} className="card mb-4">
          {r.photo && (
            <img
              src={r.photo}
              className="card-img-top"
              style={{ height:'200px', objectFit:'cover' }}
            />
          )}
          <div className="card-body">
            <h5 className="card-title">{r.pet_name}</h5>
            <p className="card-text">{r.comment}</p>
            <p className="text-muted">
              {new Date(r.posted_at).toLocaleString()} — [{r.last_seen_latitude?.toFixed(5)},{r.last_seen_longitude?.toFixed(5)}]
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
