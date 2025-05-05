import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register({ addToast, onLogin }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/register', form);
      localStorage.setItem('token', data.token);
      onLogin(data.token);                 // ⬅️  inicia sesión directo
      addToast('Registro exitoso', 'success');
      navigate('/pets', { replace: true });
    } catch {
      addToast('Error en el registro', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <input name="name"     value={form.name}
             onChange={handleChange}  className="form-control mb-2"
             placeholder="Nombre" required />

      <input name="email"    type="email" value={form.email}
             onChange={handleChange}  className="form-control mb-2"
             placeholder="Correo" required />

      <input name="password" type="password" value={form.password}
             onChange={handleChange}  className="form-control mb-2"
             placeholder="Contraseña" required />

      <input name="password_confirmation" type="password"
             value={form.password_confirmation}
             onChange={handleChange}  className="form-control mb-3"
             placeholder="Repite contraseña" required />

      <button className="btn btn-primary w-100">Registrarse</button>
    </form>
  );
}
