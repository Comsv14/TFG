import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

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
      addToast('Registro exitoso. Ahora inicia sesión.', 'success');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      const errs = err.response?.data?.errors;
      if (errs) {
        addToast(Object.values(errs).flat().join('\n'), 'error');
      } else {
        addToast(err.response?.data?.message || 'Error en registro', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-auth">
      <h2>Registro de Usuario</h2>
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
          placeholder="Repite la contraseña"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p className="mt-3 text-center">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="btn btn-link p-0">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
