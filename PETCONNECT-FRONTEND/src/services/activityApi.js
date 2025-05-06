import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default {
  async list() {
    const { data } = await api.get('/activities');
    return data.data ?? data;
  },

  async rate(id, rating) {
    return api.post(`/activities/${id}/rate`, { rating });
  },
};
