import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Toast from './components/Toast';
import Pets from './pages/Pets';
import LostPets from './pages/LostPets';
import Activities from './pages/Activities';
// …otros imports…

export default function App() {
  const [toasts, setToasts] = useState([]);

  // Crea un nuevo toast
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const bg = type === 'error' ? '#dc3545'
             : type === 'success'   ? '#28a745'
             : '#17a2b8'; // info
    setToasts(ts => [...ts, { id, message, bg }]);
  }, []);

  // Elimina un toast por id
  const removeToast = useCallback(id => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  return (
    <BrowserRouter>
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>

      {/* Pasamos addToast como prop a las páginas */}
      <Routes>
        <Route path="/pets" element={<Pets addToast={addToast} />} />
        <Route path="/lost-pets" element={<LostPets addToast={addToast} />} />
        <Route path="/activities" element={<Activities addToast={addToast} />} />
        {/* …otras rutas… */}
      </Routes>
    </BrowserRouter>
  );
}
