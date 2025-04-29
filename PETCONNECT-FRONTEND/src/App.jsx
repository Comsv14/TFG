// PETCONNECT-FRONTEND/src/App.jsx
import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Toast from './components/Toast';
import Pets from './pages/Pets';
import LostPets from './pages/LostPets';
import Activities from './pages/Activities';
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  const [toasts, setToasts] = useState([]);

  // Añade un nuevo toast
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

  // Elimina un toast por id
  const removeToast = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      {/* Contenedor de toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>

      {/* Rutas de la app, pasamos addToast*/}
      <Routes>
        <Route path="/register" element={<Register addToast={addToast} />} />
        <Route path="/login" element={<Login addToast={addToast} />} />
        <Route path="/pets" element={<Pets addToast={addToast} />} />
        <Route path="/lost-pets" element={<LostPets addToast={addToast} />} />
        <Route path="/activities" element={<Activities addToast={addToast} />} />
      </Routes>
    </>
  );
}
