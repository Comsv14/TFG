// PETCONNECT-FRONTEND/src/App.jsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
  useLocation
} from 'react-router-dom';
import api from './api/axios';
import Toast from './components/Toast';
import Pets from './pages/Pets';
import LostPets from './pages/LostPets';
import Activities from './pages/Activities';
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  // Cada vez que cambie el token, guardamos o borramos localStorage
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Añade un toast
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const bg =
      type === 'error'
        ? '#dc3545'
        : type === 'success'
        ? '#28a745'
        : '#17a2b8';
    setToasts((ts) => [...ts, { id, message, bg }]);
  }, []);

  // Elimina un toast
  const removeToast = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  // Logout: llama a la API, borra token y redirige a login
  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } catch (e) {
      console.error(e);
    } finally {
      setToken(null);
      addToast('Has cerrado sesión', 'info');
      navigate('/login', { replace: true });
    }
  };

  // Si no estás logueado y estás en ruta protegida, redirige a /login
  const RequireAuth = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
  };

  // Si estás logueado y vas a /login o /register, envía a /pets
  const RequireGuest = ({ children }) => {
    if (token) {
      return <Navigate to="/pets" replace />;
    }
    return children;
  };

  return (
    <>
      {/* Navbar solo si hay token */}
      {token && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <NavLink className="navbar-brand" to="/pets">
              PetConnect
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink
                    to="/pets"
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                  >
                    Mis Mascotas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/activities"
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                  >
                    Actividades
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/lost-pets"
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                  >
                    Perdidas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Toasts */}
      <div
        className="toast-container"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1080
        }}
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>

      {/* Rutas */}
      <div className="container mt-4">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <RequireGuest>
                <Login
                  addToast={addToast}
                  onLogin={(tok) => setToken(tok)}
                />
              </RequireGuest>
            }
          />
          <Route
            path="/register"
            element={
              <RequireGuest>
                <Register addToast={addToast} />
              </RequireGuest>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/pets"
            element={
              <RequireAuth>
                <Pets addToast={addToast} />
              </RequireAuth>
            }
          />
          <Route
            path="/activities"
            element={
              <RequireAuth>
                <Activities addToast={addToast} />
              </RequireAuth>
            }
          />
          <Route
            path="/lost-pets"
            element={
              <RequireAuth>
                <LostPets addToast={addToast} />
              </RequireAuth>
            }
          />

          {/* Redirecciones */}
          <Route
            path="/"
            element={
              token ? <Navigate to="/pets" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
