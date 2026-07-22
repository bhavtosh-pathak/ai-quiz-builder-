import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aqb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let unauthorizedHandler = null;
export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    const normalizedError = new Error(message);
    normalizedError.status = status;

    if (status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(normalizedError);
  }
);

export default api;