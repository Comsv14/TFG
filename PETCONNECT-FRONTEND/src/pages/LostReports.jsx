import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function LostReports() {
  const [reports, setReports] = useState([]);
  const [mode, setMode] = useState('lost'); // lost | found
  const [form, setForm] = useState({
    pet_id: '',
    comment: '',
    happened_at: '',
    latitude: null,
    longitude: null,
    photo: null,
  });

  // Carga inicial y al cambiar modo
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/lost-reports', {
          params: { type: mode }
        });
        setReports(res.data);
      } catch {
        alert('Error al cargar reportes');
      }
    })();
  }, [mode]);

  // Cambios en inputs
  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value
    }));
  };

  // Cambio de ubicación desde el mapa
  const handleMap = (lat, lng) => {
    setForm(f => ({
      ...f,
      latitude: lat,
      longitude: lng
    }));
  };

  // Envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== '') fd.append(k, v);
      });
      fd.append('type', mode);

      await api.post('/lost-reports', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Limpia & recarga
      setForm({
        pet_id: '',
        comment: '',
        happened_at: '',
        latitude: null,
        longitude: null,
        photo: null
      });
      const res = await api.get('/lost-reports', { params: { type: mode } });
      setReports(res.data);

      alert(
        mode === 'lost'
          ? 'Reporte de pérdida enviado'
          : 'Reporte de hallazgo enviado'
      );
    } catch {
      alert('Error al enviar reporte');
    }
  };

  // Marca encontrada
  const toggleResolved = async id => {
    try {
      await api.post(`/lost-reports/${id}/toggle-resolved`);
      const res = await api.get('/lost-reports', { params: { type: mode } });
      setReports(res.data);
    } catch {
      alert('Error al actualizar estado');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mascotas Perdidas</h2>

      <div className="btn-group mb-3">
        <button
          className={`btn ${
            mode === 'lost' ? 'btn-danger' : 'btn-outline-danger'
          }`}
          onClick={() => setMode('lost')}
        >
          ¿Has perdido tu mascota?
        </button>
        <button
          className={`btn ${
            mode === 'found' ? 'btn-success' : 'btn-outline-success'
          }`}
          onClick={() => setMode('found')}
        >
          ¿Has encontrado una mascota?
        </button>
      </div>

      <div className="card p-3 mb-4">
        <form onSubmit={handleSubmit}>
          {mode === 'lost' && (
            <select
              name="pet_id"
              className="form-select mb-2"
              value={form.pet_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu mascota</option>
              {/* Aquí deberías mapear tus propias mascotas */}
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

          <label>Ubicación (haz click en el mapa)</label>
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
            className={`btn ${
              mode === 'lost' ? 'btn-danger' : 'btn-success'
            }`}
          >
            {mode === 'lost' ? 'Reportar pérdida' : 'Reportar hallazgo'}
          </button>
        </form>
      </div>

      <h3>
        Listado de {mode === 'lost' ? 'pérdidas' : 'hallazgos'} (
        {reports.length})
      </h3>

      <ul className="list-group">
        {reports.map(r => (
          <li
            key={r.id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              <strong>
                {r.type === 'lost'
                  ? r.pet?.pet_name || '(sin mascota)'
                  : 'Hallazgo'}
              </strong>
              <p>{r.comment}</p>
              <small>{new Date(r.happened_at).toLocaleString()}</small>
              {r.latitude && (
                <p>
                  Coordenadas: {r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}
                </p>
              )}
            </div>

            {mode === 'lost' && (
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => toggleResolved(r.id)}
              >
                {r.resolved ? 'Reabrir' : 'Marcar encontrada'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
