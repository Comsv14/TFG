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

  useEffect(() => {
    token
      ? localStorage.setItem('token', token)
      : localStorage.removeItem('token');
  }, [token]);

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

  const removeToast = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } catch {
      /* ignoramos errores */
    } finally {
      setToken(null);
      addToast('Has cerrado sesión', 'info');
      navigate('/login', { replace: true });
    }
  };

  const RequireAuth = ({ children }) => {
    return token ? children : <Navigate to="/login" replace state={{ from: location }}/> ;
  };

  const RequireGuest = ({ children }) => {
    return token ? <Navigate to="/pets" replace /> : children;
  };

  return (
    <>
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

      <div className="container mt-4">
        <Routes>
          <Route
            path="/register"
            element={
              <RequireGuest>
                <Register addToast={addToast} />
              </RequireGuest>
            }
          />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <Login addToast={addToast} onLogin={(tok) => setToken(tok)} />
              </RequireGuest>
            }
          />

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
