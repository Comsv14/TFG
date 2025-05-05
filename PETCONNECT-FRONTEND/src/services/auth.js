import api from '../api/axios';

export async function login(email, password) {
  await api.get('/sanctum/csrf-cookie');
  const { data } = await api.post('/api/login', { email, password });
  if (data.token) localStorage.setItem('token', data.token);
  return data.user || data;
}
