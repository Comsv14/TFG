// src/pages/LostReports.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function LostReports({ addToast, user }) {
  const [mode, setMode] = useState('lost'); // 'lost' | 'found'
  const [reports, setReports] = useState([]);
  const [petsList, setPetsList] = useState([]);
  const [form, setForm] = useState({
    pet_id: '',
    comment: '',
    happened_at: '',
    latitude: null,
    longitude: null,
    photo: null,
  });

  // 1) Cargar pets
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/pets');
        setPetsList(data);
      } catch {
        addToast('No se pudieron cargar tus mascotas', 'error');
      }
    })();
  }, [addToast]);

  // 2) Cargar reportes cada vez que cambie mode
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/lost-reports', { params:{ type: mode }});
        setReports(res.data);
      } catch {
        addToast('Error al cargar reportes', 'error');
      }
    })();
  }, [mode, addToast]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name==='photo' ? files[0] : value
    }));
  };

  const handleMap = (lat,lng) => {
    setForm(f => ({ ...f, latitude: lat, longitude: lng }));
  };

  // 3) Enviar reporte
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => {
        if (v!==null && v!=='') fd.append(k,v);
      });
      fd.append('type', mode);
      await api.post('/api/lost-reports', fd, {
        headers: { 'Content-Type':'multipart/form-data' }
      });
      addToast(mode==='lost'? 'Pérdida reportada':'Hallazgo reportado','success');

      setForm({ pet_id:'', comment:'', happened_at:'', latitude:null, longitude:null, photo:null });
      const r2 = await api.get('/api/lost-reports', { params:{type:mode}});
      setReports(r2.data);
    } catch {
      addToast('Error al enviar reporte','error');
    }
  };

  // 4) Marcar encontrada (solo dueño)
  const toggleResolved = async id => {
    try {
      await api.post(`/api/lost-reports/${id}/toggle-resolved`);
      const r2 = await api.get('/api/lost-reports',{ params:{type:mode}});
      setReports(r2.data);
    } catch {
      addToast('Error al actualizar reporte','error');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mascotas Perdidas</h2>

      <div className="btn-group mb-3">
        <button
          className={`btn ${mode==='lost'?'btn-danger':'btn-outline-danger'}`}
          onClick={()=>setMode('lost')}
        >¿Has perdido tu mascota?</button>
        <button
          className={`btn ${mode==='found'?'btn-success':'btn-outline-success'}`}
          onClick={()=>setMode('found')}
        >¿Has encontrado una mascota?</button>
      </div>

      <div className="card p-3 mb-4">
        <form onSubmit={handleSubmit}>
          {mode==='lost' && (
            <select
              name="pet_id"
              className="form-select mb-2"
              value={form.pet_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu mascota</option>
              {petsList.map(p=>(
                <option key={p.id} value={p.id}>
                  {p.name /* antes usábamos p.pet_name, pero tu API responde `name` */}
                </option>
              ))}
            </select>
          )}
          <textarea
            name="comment"
            className="form-control mb-2"
            placeholder="Comentario"
            value={form.comment}
            onChange={handleChange}
          />
          <input
            type="datetime-local"
            name="happened_at"
            className="form-control mb-2"
            value={form.happened_at}
            onChange={handleChange}
          />
          <label className="form-label">Ubicación (haz click en el mapa)</label>
          <MapPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={handleMap}
          />
          <div className="mb-2 mt-2">
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className={`btn ${mode==='lost'?'btn-danger':'btn-success'}`}
          >
            {mode==='lost'?'Reportar Pérdida':'Reportar Hallazgo'}
          </button>
        </form>
      </div>

      <h3>Listado de {mode==='lost'?'pérdidas':'hallazgos'} ({reports.length})</h3>
      <ul className="list-group">
        {reports.map(r=>(
          <li
            key={r.id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              <strong>
                {r.type==='lost'
                  ? (r.pet?.name ?? '(sin mascota)')
                  : 'Hallazgo'}
              </strong>
              <p>{r.comment}</p>
              <small>{new Date(r.happened_at).toLocaleString()}</small>
              {typeof r.latitude==='number' &&
               typeof r.longitude==='number' && (
                <p>
                  Coordenadas:{' '}
                  {Number(r.latitude).toFixed(5)},{' '}
                  {Number(r.longitude).toFixed(5)}
                </p>
              )}
            </div>

            {mode==='lost' && r.user?.id === user.id && (
              <button
                className="btn btn-sm btn-outline-success"
                onClick={()=>toggleResolved(r.id)}
              >
                {r.resolved?'Reabrir':'Marcar encontrada'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
