// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login({ addToast, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/login', form);
      // guardamos el token y disparamos el cambio de estado en App.jsx
      localStorage.setItem('token', data.token);
      onLogin(data.token);
      addToast('Has iniciado sesión con éxito', 'success');
      navigate('/pets');
    } catch (err) {
      addToast('Credenciales inválidas', 'error');
    }
  }

  return (
    <div className="page-auth">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
          className="form-control mb-3"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100" type="submit">
          Acceder
        </button>
      </form>
    </div>
  );
}
