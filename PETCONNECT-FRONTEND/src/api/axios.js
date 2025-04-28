// PETCONNECT-FRONTEND/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // o tu URL real de Laravel
  withCredentials: true,              // muy importante para Sanctum
  headers: { 'Content-Type': 'application/json' }
});

// opcional: interceptar errores 401 para redirigir al login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
