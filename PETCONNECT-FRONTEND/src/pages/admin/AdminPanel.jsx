import'../../assets/css/adminpanel.css';
import { Outlet, NavLink } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="row">
      <aside className="col-md-3">
        <h4>Panel de Administración</h4>
        <ul className="list-group">
          <li><NavLink className="list-group-item" to="users">Usuarios</NavLink></li>
          <li><NavLink className="list-group-item" to="pets">Mascotas</NavLink></li>
          <li><NavLink className="list-group-item" to="activities">Actividades</NavLink></li>
          <li><NavLink className="list-group-item" to="reports">Reportes Perdidas</NavLink></li>
          <li><NavLink className="list-group-item" to="comments">Comentarios</NavLink></li>
          <li><NavLink className="list-group-item" to="stats">Estadísticas</NavLink></li>
        </ul>
      </aside>
      <main className="col-md-9">
        <Outlet />
      </main>
    </div>
  );
}
