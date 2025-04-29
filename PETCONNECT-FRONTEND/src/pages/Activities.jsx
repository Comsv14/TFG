import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';

export default function Activities({ addToast }) {
  const [activities, setActivities] = useState([]);
  const [tab, setTab] = useState('comunidad');    // 'comunidad' | 'inscritas'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('fecha_asc');   // 'fecha_asc' | 'fecha_desc' | 'titulo'

  // Función para cargar
  const cargarActividades = async () => {
    try {
      const { data } = await api.get('/api/activities');
      setActivities(data);
    } catch (err) {
      console.error(err);
      addToast('Error al cargar actividades', 'error');
    }
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  // Filtrar/buscar/ordenar
  const filtered = useMemo(() => {
    let list = [...activities];

    if (tab === 'inscritas') {
      list = list.filter(a => a.is_registered);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.user?.name || '').toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sort === 'fecha_asc') return new Date(a.starts_at) - new Date(b.starts_at);
      if (sort === 'fecha_desc') return new Date(b.starts_at) - new Date(a.starts_at);
      if (sort === 'titulo') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [activities, tab, search, sort]);

  // Apuntarse
  const handleJoin = async (id) => {
    try {
      await api.post(`/api/activities/${id}/register`);
      addToast('Inscripción correcta', 'success');
      await cargarActividades();
    } catch (err) {
      console.error(err);
      addToast('Error al inscribirse', 'error');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Actividades Colectivas</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={'nav-link ' + (tab === 'comunidad' ? 'active' : '')}
            onClick={() => setTab('comunidad')}
          >
            Comunidad
          </button>
        </li>
        <li className="nav-item">
          <button
            className={'nav-link ' + (tab === 'inscritas' ? 'active' : '')}
            onClick={() => setTab('inscritas')}
          >
            Mis Inscritas
          </button>
        </li>
      </ul>

      {/* Formulario solo en Comunidad */}
      {tab === 'comunidad' && (
        <div className="mb-4">
          <ActivityForm
            addToast={addToast}
            onCreated={() => {
              addToast('Actividad creada con éxito', 'success');
              cargarActividades();
            }}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="row g-2 mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título o creador…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="fecha_asc">Fecha ↑</option>
            <option value="fecha_desc">Fecha ↓</option>
            <option value="titulo">Título</option>
          </select>
        </div>
      </div>

      {/* Listado */}
      <div className="row">
        {filtered.length > 0 ? (
          filtered.map(act => (
            <div className="col-md-6 mb-3" key={act.id}>
              <ActivityCard
                activity={act}
                onJoin={() => handleJoin(act.id)}
                addToast={addToast}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No hay actividades.</p>
        )}
      </div>
    </div>
  );
}
