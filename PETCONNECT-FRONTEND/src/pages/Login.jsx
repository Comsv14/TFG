import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../assets/css/login.css';
import logo from '../assets/img/petconnect-logo.png'; // usa tu logotipo aquí

export default function Login({ addToast, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.get('/sanctum/csrf-cookie');
      const { data } = await api.post('/api/login', form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.token);
      addToast('Inicio de sesión exitoso', 'success');

      if (data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/pets', { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Correo o contraseña incorrectos', 'error');
      } else {
        addToast('Error al iniciar sesión', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-info">
        <img src={logo} alt="PetConnect logo" className="login-logo" />
        <h1>PetConnect</h1>
        <p>Conecta con otros dueños de mascotas, organiza paseos, reporta mascotas perdidas y mucho más. Únete a la comunidad petlover más activa.</p>
      </div>

      <div className="page-auth">
        <h2 className="mb-4 text-center">Iniciar Sesión</h2>

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
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-3 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="btn btn-link p-0">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
