// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // cabecera para Bearer token
    config.headers.Authorization = `Bearer ${token}`;
    // y por si acaso también en common
    config.headers.common = {
      ...config.headers.common,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default api;
