import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('aqb_token');
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
      sessionStorage.removeItem('aqb_token');
      sessionStorage.removeItem('aqb_user');
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;