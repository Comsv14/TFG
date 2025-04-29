// PETCONNECT-FRONTEND/src/pages/Register.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register({ addToast }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/register', form);
      addToast('Registro exitoso. ¡Bienvenido!', 'success');
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        const msgs = Object.values(err.response.data.errors).flat().join('\n');
        addToast(msgs, 'error');
      } else {
        addToast(err.response?.data?.message || 'Error en el registro', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          className="form-control mb-2"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="form-control mb-2"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="password_confirmation"
          type="password"
          className="form-control mb-3"
          placeholder="Repetir contraseña"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
