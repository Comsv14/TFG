import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  // withCredentials: true,  <— ya no lo necesitas
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // garantiza que exista el objeto headers
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
