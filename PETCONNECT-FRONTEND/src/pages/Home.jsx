import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center mt-5">
      <h1>Bienvenido a PetConnect</h1>
      <p className="lead">Regístrate o inicia sesión para comenzar a conectar con otros dueños y mascotas.</p>
      <Link to="/register" className="btn btn-primary me-2">Registrarse</Link>
      <Link to="/login" className="btn btn-outline-primary">Iniciar Sesión</Link>
    </div>
  );
}
