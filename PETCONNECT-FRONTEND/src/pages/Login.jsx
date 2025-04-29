import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login({ addToast, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await api.post('/api/login', form);
      onLogin(data.token);
      addToast('Inicio de sesión exitoso', 'success');
      navigate('/pets', { replace: true });
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || 'Credenciales incorrectas',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

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
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className="mt-3 text-center">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="btn btn-link p-0">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
