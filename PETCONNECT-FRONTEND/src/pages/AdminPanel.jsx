// src/pages/AdminPanel.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminPanel() {
  return (
    <div>
      <h2 className="mb-4">Panel de Administración</h2>
      <div className="list-group mb-4">
        <Link to="users" className="list-group-item list-group-item-action">
          Gestión de Usuarios
        </Link>
        <Link to="pets" className="list-group-item list-group-item-action">
          Gestión de Mascotas
        </Link>
        <Link to="activities" className="list-group-item list-group-item-action">
          Gestión de Actividades
        </Link>
        <Link to="reports" className="list-group-item list-group-item-action">
          Reportes de Mascotas Perdidas
        </Link>
        <Link to="comments" className="list-group-item list-group-item-action">
          Comentarios
        </Link>
        <Link to="stats" className="list-group-item list-group-item-action">
          Estadísticas y Notificaciones
        </Link>
      </div>

      {/* Aquí se renderiza la ruta hija */}
      <Outlet />
      
    </div>
  );
}
