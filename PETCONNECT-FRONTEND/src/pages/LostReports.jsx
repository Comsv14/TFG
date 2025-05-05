// src/pages/LostReports.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function LostReports({ addToast, user }) {
  // Estado de todos los reportes cargados
  const [lostReports, setLostReports] = useState([]);

  // Estado para "he perdido mi mascota"
  const [mode, setMode] = useState('lost'); // 'lost' | 'found'
  const [myPets, setMyPets] = useState([]);
  const [form, setForm] = useState({
    pet_id: '',
    comment: '',
    happened_at: '',
    latitude: null,
    longitude: null,
    photo: null,
  });

  // Cargar al montar: mis mascotas y los reportes existentes
  useEffect(() => {
    (async () => {
      try {
        const [petsRes, reportsRes] = await Promise.all([
          api.get('/api/pets'),
          api.get('/api/lost-reports'),
        ]);
        setMyPets(petsRes.data);
        setLostReports(reportsRes.data);
      } catch (e) {
        addToast('Error cargando datos', 'error');
      }
    })();
  }, [addToast]);

  // Handle change de inputs
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm(f => ({ ...f, photo: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  // Handle ubicación via MapPicker
  function handleMap(lat, lng) {
    setForm(f => ({ ...f, latitude: lat, longitude: lng }));
  }

  // Submit del formulario
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (mode === 'lost') {
        fd.append('pet_id', form.pet_id);
        fd.append('comment', form.comment);
        fd.append('happened_at', form.happened_at);
        fd.append('latitude', form.latitude);
        fd.append('longitude', form.longitude);
        if (form.photo) fd.append('photo', form.photo);
      } else {
        // 'found' mode: solo comment + ubicacion + foto + happened_at
        fd.append('comment', form.comment);
        fd.append('happened_at', form.happened_at);
        fd.append('latitude', form.latitude);
        fd.append('longitude', form.longitude);
        if (form.photo) fd.append('photo', form.photo);
      }

      const url = mode === 'lost' ? '/api/lost-reports' : '/api/lost-reports/found';
      const res = await api.post(url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Añadimos el nuevo reporte al listado
      setLostReports(rs => [res.data, ...rs]);
      addToast('Reporte enviado', 'success');
      // Limpiamos formulario
      setForm({
        pet_id: '',
        comment: '',
        happened_at: '',
        latitude: null,
        longitude: null,
        photo: null,
      });
    } catch (err) {
      addToast('Error al enviar reporte', 'error');
    }
  }

  return (
    <div>
      <h1>Reportes de Mascotas Perdidas</h1>

      <div className="mb-4">
        <button
          className={`btn me-2 ${mode==='lost'?'btn-danger':'btn-outline-danger'}`}
          onClick={()=>setMode('lost')}
        >
          ¿Has perdido tu mascota?
        </button>
        <button
          className={`btn ${mode==='found'?'btn-success':'btn-outline-success'}`}
          onClick={()=>setMode('found')}
        >
          ¿Has encontrado una mascota?
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 mb-5">
        {mode === 'lost' && (
          <select
            name="pet_id"
            className="form-select mb-3"
            required
            value={form.pet_id}
            onChange={handleChange}
          >
            <option value="">Selecciona tu mascota</option>
            {myPets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}

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

        <label className="form-label">Ubicación (haz click en el mapa)</label>
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

        <button className={`btn ${mode==='lost'?'btn-danger':'btn-success'}`}>
          {mode==='lost'?'Reportar Pérdida':'Reportar Avistamiento'}
        </button>
      </form>

      <div>
        {lostReports.map(r => (
          <div key={r.id} className="card mb-4">
            {r.photo && (
              <img
                src={r.photo}
                alt={r.comment}
                className="card-img-top"
                style={{ objectFit:'cover', height:'200px' }}
              />
            )}
            <div className="card-body">
              <h5 className="card-title">
                {(r.pet || {}).name || 'Mascota encontrada'}
              </h5>
              <p className="card-text">{r.comment}</p>
              <p className="card-text">
                <small className="text-muted">
                  {new Date(r.happened_at).toLocaleString()} en [{r.latitude?.toFixed(5)},{r.longitude?.toFixed(5)}]
                </small>
              </p>

              <hr/>
              <h6>Comentarios</h6>
              {r.comments?.map(c => (
                <div key={c.id} className="mb-2">
                  <strong>{c.user.name}</strong>: {c.body}
                </div>
              ))}
              {/* aquí podrías añadir form para nuevos comentarios */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
