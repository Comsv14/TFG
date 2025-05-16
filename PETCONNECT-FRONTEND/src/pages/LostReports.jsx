// src/pages/LostReports.jsx
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';

export default function LostReports({ addToast, user }) {
  const [reports, setReports] = useState([]);
  const [myPets, setMyPets] = useState([]); // Tus mascotas
  const [form, setForm] = useState({
    type: 'lost',
    pet_id: '',
    pet_name: '',
    comment: '',
    happened_at: '',
    latitude: null,
    longitude: null,
    photo: null,
  });

  // Obtener reportes y mascotas del usuario
  const fetchReportsAndPets = useCallback(async () => {
    try {
      const [reportsRes, petsRes] = await Promise.all([
        api.get('/api/lost-reports'),
        api.get('/api/pets')
      ]);
      setReports(reportsRes.data);
      setMyPets(petsRes.data);
    } catch {
      addToast('Error cargando reportes o mascotas', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchReportsAndPets();
  }, [fetchReportsAndPets]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'photo' ? files[0] : value,
    }));

    // Si selecciona una mascota, se autocompletan nombre y foto
    if (name === 'pet_id' && value) {
      const selectedPet = myPets.find((pet) => pet.id.toString() === value);
      if (selectedPet) {
        setForm((prev) => ({
          ...prev,
          pet_name: selectedPet.name,
          photo: selectedPet.photo ? selectedPet.photo : null,
        }));
      }
    }
  };

  // Manejar mapa
  const handleMap = (lat, lng) => {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  // Enviar reporte
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) fd.append(key, form[key]);
      });

      await api.post('/api/lost-reports', fd);
      fetchReportsAndPets();
      resetForm();
      addToast('Reporte enviado', 'success');
    } catch {
      addToast('Error al enviar el reporte', 'error');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setForm({
      type: 'lost',
      pet_id: '',
      pet_name: '',
      comment: '',
      happened_at: '',
      latitude: null,
      longitude: null,
      photo: null,
    });
  };

  return (
    <Fragment>
      <h1 className="mb-4">Reportar Mascota Perdida o Encontrada</h1>

      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        {/* Tipo de reporte */}
        <div className="mb-3">
          <label className="form-label">Tipo de Reporte</label>
          <select name="type" value={form.type} onChange={handleChange} className="form-select">
            <option value="lost">Reportar Mascota Perdida</option>
            <option value="found">Reportar Mascota Encontrada</option>
          </select>
        </div>

        {/* Selección de mascota o nombre */}
        {form.type === 'lost' ? (
          <div className="mb-3">
            <label className="form-label">Selecciona tu Mascota</label>
            <select
              name="pet_id"
              className="form-select"
              value={form.pet_id}
              onChange={handleChange}
            >
              <option value="">-- Selecciona tu mascota --</option>
              {myPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label">Nombre de la Mascota Encontrada</label>
            <input
              name="pet_name"
              className="form-control"
              placeholder="Nombre de la mascota encontrada"
              value={form.pet_name}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Foto (solo se muestra si es mascota perdida y tiene foto) */}
        {form.type === 'lost' && form.photo && (
          <div className="mb-3 text-center">
            <img
              src={form.photo}
              alt="Foto de la mascota"
              style={{ maxHeight: 150, objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label">Descripción del Reporte</label>
          <textarea
            name="comment"
            className="form-control"
            placeholder="Describe los detalles del reporte"
            value={form.comment}
            onChange={handleChange}
          />
        </div>

        {/* Fecha */}
        <div className="mb-3">
          <label className="form-label">Fecha del Incidente</label>
          <input
            type="datetime-local"
            name="happened_at"
            className="form-control"
            value={form.happened_at}
            onChange={handleChange}
          />
        </div>

        {/* Mapa */}
        <div className="mb-3">
          <label className="form-label">Ubicación (Mapa)</label>
          <MapPicker latitude={form.latitude} longitude={form.longitude} onChange={handleMap} />
        </div>

        {/* Foto personalizada (solo si es encontrada) */}
        {form.type === 'found' && (
          <div className="mb-3">
            <label className="form-label">Foto (Opcional)</label>
            <input type="file" name="photo" className="form-control" onChange={handleChange} />
          </div>
        )}

        {/* Botón Enviar */}
        <button className="btn btn-primary w-100 mt-3">Enviar Reporte</button>
      </form>
    </Fragment>
  );
}
