// src/App.jsx
import AdminPanel from './pages/AdminPanel';
import UserAdmin from './pages/admin/UserAdmin';
import PetAdmin from './pages/admin/PetAdmin';
import ActivityAdmin from './pages/admin/ActivityAdmin';
import ReportAdmin from './pages/admin/ReportAdmin';
import CommentAdmin from './pages/admin/CommentAdmin';
import StatsAdmin from './pages/admin/StatsAdmin';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import api from './api/axios';
import Toast from './components/Toast';
import Pets from './pages/Pets';
import Activities from './pages/Activities';
import LostPets from './pages/LostPets';
import LostReports from './pages/LostReports';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      (async () => {
        try {
          const { data } = await api.get('/api/profile');
          setUser(data);
          fetchNotifications();
        } catch (e) {
          console.error(e);
        }
      })();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/api/notifications');
      setNotifications(data);
    } catch (e) {
      console.error('Error cargando notificaciones:', e);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/api/notifications/${notificationId}/mark-as-read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read_at: new Date() } : n
        )
      );
    } catch (e) {
      console.error('Error marcando notificación como leída:', e);
    }
  };

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const bg = type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8';
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
            <NavLink className="navbar-brand" to="/pets">PetConnect</NavLink>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item"><NavLink to="/pets" className="nav-link">Mis Mascotas</NavLink></li>
                <li className="nav-item"><NavLink to="/activities" className="nav-link">Actividades</NavLink></li>
                <li className="nav-item"><NavLink to="/lost-pets" className="nav-link">Mascotas Perdidas</NavLink></li>
                <li className="nav-item"><NavLink to="/lost-reports" className="nav-link">Reportes Perdidas</NavLink></li>
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <NavLink to="/admin" className="nav-link">Panel Admin</NavLink>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <button className="btn btn-outline-secondary position-relative" type="button" data-bs-toggle="dropdown">🔔
                    {notifications.filter(n => !n.read_at).length > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {notifications.filter(n => !n.read_at).length}
                      </span>
                    )}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {notifications.length === 0 ? (
                      <li className="dropdown-item text-muted">Sin notificaciones</li>
                    ) : (
                      notifications.map(n => (
                        <li key={n.id} className="dropdown-item">
                          {n.message}
                          {!n.read_at && (
                            <button className="btn btn-sm btn-link text-primary" onClick={() => markAsRead(n.id)}>Marcar como leída</button>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <NavLink to="#" className="nav-link dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown">
                    <img src={user.avatar_url || '/default-avatar.png'} alt="avatar" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                  </NavLink>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><NavLink className="dropdown-item" to="/profile">Mi Perfil</NavLink></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      <div className="toast-container" style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1080 }}>
        {toasts.map((t) => <Toast key={t.id} {...t} onClose={removeToast} />)}
      </div>

      <div className="container mt-4">
        <Routes>
          <Route path="/admin" element={
            <RequireAuth>
              {user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/pets" replace />}
            </RequireAuth>
          }>
            <Route path="users" element={<UserAdmin />} />
            <Route path="pets" element={<PetAdmin />} />
            <Route path="activities" element={<ActivityAdmin />} />
            <Route path="reports" element={<ReportAdmin />} />
            <Route path="comments" element={<CommentAdmin />} />
            <Route path="stats" element={<StatsAdmin />} />
          </Route>

          <Route path="/register" element={<RequireGuest><Register addToast={addToast} onLogin={setToken} /></RequireGuest>} />
          <Route path="/login" element={<RequireGuest><Login addToast={addToast} onLogin={setToken} /></RequireGuest>} />
          <Route path="/profile" element={<RequireAuth><Profile addToast={addToast} user={user} /></RequireAuth>} />
          <Route path="/pets" element={<RequireAuth><Pets addToast={addToast} user={user} /></RequireAuth>} />
          <Route path="/activities" element={<RequireAuth><Activities addToast={addToast} user={user} /></RequireAuth>} />
          <Route path="/lost-pets" element={<RequireAuth><LostPets addToast={addToast} user={user} /></RequireAuth>} />
          <Route path="/lost-reports" element={<RequireAuth><LostReports addToast={addToast} user={user} /></RequireAuth>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
}
