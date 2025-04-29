import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Profile({ addToast }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/profile');
        setForm({ name: data.name, email: data.email, avatar: null });
        setAvatarPreview(data.avatar_url);
      } catch (err) {
        console.error(err);
        addToast('Error al cargar perfil', 'error');
      }
    })();
  }, [addToast]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      const file = files[0];
      setForm((f) => ({ ...f, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      if (form.avatar) fd.append('avatar', form.avatar);

      const { data } = await api.post('/api/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm((f) => ({ ...f, avatar: null }));
      setAvatarPreview(data.avatar_url);
      addToast('Perfil actualizado', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error al actualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-auth">
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit}>
        {avatarPreview && (
          <div className="mb-3 text-center">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="rounded-circle mb-2"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Foto de perfil</label>
          <input
            name="avatar"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <input
          name="name"
          className="form-control mb-2"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
