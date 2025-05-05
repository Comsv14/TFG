import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function LostReports({ addToast, user }) {
  /* --------------- state --------------- */
  const [lostReports, setLostReports] = useState([]);
  const [myPets,      setMyPets]      = useState([]);
  const [form,        setForm]        = useState({
    pet_id: '',
    comment: '',
    happened_at: '',
    latitude: null,
    longitude: null,
    photo: null,
  });

  /* --------------- fetch --------------- */
  const fetchData = useCallback(async () => {
    try {
      const [petsRes, reportsRes] = await Promise.all([
        api.get('/api/pets'),
        api.get('/api/lost-pets'),
      ]);

      setMyPets(
        Array.isArray(petsRes.data) ? petsRes.data : petsRes.data?.data || []
      );

      const arr =
        Array.isArray(reportsRes.data)
          ? reportsRes.data
          : Array.isArray(reportsRes.data?.data)
          ? reportsRes.data.data
          : [];
      setLostReports(arr);
    } catch {
      addToast('Error cargando datos', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, []);                     // ← solo al montar

  /* --------------- handlers --------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'photo' ? files[0] : value,
    }));
  };

  const handleMap = (lat, lng) => {
    setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('pet_name', form.pet_id);          // usar pet_id si tu API lo requiere
      fd.append('comment',  form.comment);
      fd.append('happened_at', form.happened_at);
      fd.append('latitude',  form.latitude);
      fd.append('longitude', form.longitude);
      if (form.photo) fd.append('photo', form.photo);

      const res = await api.post('/api/lost-pets', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      /* Normaliza uno solo y lo añade al inicio */
      const newReport = Array.isArray(res.data)
        ? res.data[0]
        : res.data?.data || res.data;
      setLostReports((r) => [newReport, ...r]);

      addToast('Enviado con éxito', 'success');
      setForm({
        pet_id: '',
        comment: '',
        happened_at: '',
        latitude: null,
        longitude: null,
        photo: null,
      });
    } catch {
      addToast('Error al enviar', 'error');
    }
  };

  /* --------------- render --------------- */
  return (
    <div>
      <h1>Reportar Mascota Perdida</h1>

      {/* ---------- formulario ---------- */}
      <form onSubmit={handleSubmit} className="card p-4 mb-5">
        <select
          name="pet_id"
          className="form-select mb-3"
          required
          value={form.pet_id}
          onChange={handleChange}
        >
          <option value="">Selecciona tu mascota</option>
          {myPets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
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

      {/* ---------- listado ---------- */}
      <h2>Listado de Pérdidas</h2>
      {lostReports.length === 0 && (
        <p className="text-muted">No hay reportes registrados.</p>
      )}

      {lostReports.map((r) => (
        <div key={r.id} className="card mb-4">
          {r.photo && (
            <img
              src={r.photo}
              className="card-img-top"
              style={{ height: 200, objectFit: 'cover' }}
              alt="reporte"
            />
          )}
          <div className="card-body">
            <h5 className="card-title">{r.pet_name}</h5>
            <p className="card-text">{r.comment}</p>
            <p className="text-muted">
              {new Date(r.posted_at).toLocaleString()} — [
              {r.lat?.toFixed(5)},{r.lng?.toFixed(5)}]
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
