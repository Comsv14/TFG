import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register({ addToast, onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  /* --------------- handlers --------------- */
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* -------- front‑end validation -------- */
    if (form.password.length < 8) {
      addToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    if (form.password !== form.password_confirmation) {
      addToast('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      setSending(true);
      const { data } = await api.post('/api/register', form);

      /* éxito -> guardar token y redirigir */
      localStorage.setItem('token', data.token);
      onLogin(data.token);
      addToast('Registro exitoso', 'success');
      navigate('/pets', { replace: true });
    } catch (e) {
      /* -------- backend 422 -------- */
      if (e.response?.status === 422 && e.response.data.errors) {
        Object.values(e.response.data.errors).forEach((arr) =>
          addToast(arr[0], 'error')
        );
      } else {
        addToast('Error en el registro', 'error');
      }
    } finally {
      setSending(false);
    }
  };

  /* --------------- render --------------- */
  return (
    <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 400 }}>
      <h2 className="text-center mb-4">Registrarse</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Nombre"
        required
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Correo"
        required
      />

      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Contraseña (mín. 8 caracteres)"
        required
      />

      <input
        name="password_confirmation"
        type="password"
        value={form.password_confirmation}
        onChange={handleChange}
        className="form-control mb-3"
        placeholder="Repite contraseña"
        required
      />

      <button
        className="btn btn-primary w-100"
        disabled={sending}
      >
        {sending ? 'Enviando…' : 'Registrarse'}
      </button>
    </form>
  );
}
