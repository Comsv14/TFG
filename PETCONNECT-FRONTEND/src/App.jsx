import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Pets from './pages/Pets';
import Activities from './pages/Activities';
import LostPets from './pages/LostPets';

function App() {
  const isAuth = true;   // <-- Fuerza a “logueado” // más adelante conectarás con tu auth real

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          {isAuth ? (
            <>
              <Route path="pets" element={<Pets />} />
              <Route path="activities" element={<Activities />} />
              <Route path="lost-pets" element={<LostPets />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
