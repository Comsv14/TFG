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
import Profile from './pages/Profile';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Al cambiar token, guardamos en localStorage y cargamos usuario
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      (async () => {
        try {
          const { data } = await api.get('/api/profile');
          setUser(data);
        } catch (e) {
          console.error(e);
        }
      })();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
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
    } catch {}
    setToken(null);
    addToast('Has cerrado sesión', 'info');
    navigate('/login', { replace: true });
  };

  const RequireAuth = ({ children }) =>
    token ? children : <Navigate to="/login" replace state={{ from: location }} />;
  const RequireGuest = ({ children }) =>
    token ? <Navigate to="/pets" replace /> : children;

  return (
    <>
      {token && user && (
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
              <ul className="navbar-nav ms-auto align-items-center">
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
                <li className="nav-item dropdown">
                  <NavLink
                    to="#"
                    className="nav-link dropdown-toggle p-0"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src={user.avatar_url || '/default-avatar.png'}
                      alt="avatar"
                      className="rounded-circle"
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                      }}
                    />
                  </NavLink>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <NavLink className="dropdown-item" to="/profile">
                        Mi Perfil
                      </NavLink>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
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
          zIndex: 1080,
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
                <Login addToast={addToast} onLogin={setToken} />
              </RequireGuest>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile addToast={addToast} />
              </RequireAuth>
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
              token ? (
                <Navigate to="/pets" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
