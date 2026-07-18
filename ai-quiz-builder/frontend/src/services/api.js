import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aqb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error messages and force logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('aqb_token');
      localStorage.removeItem('aqb_user');
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
