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

// Lets AuthContext register itself to handle expired/invalid sessions.
// Centralizing this here (instead of also clearing storage + hard-redirecting
// from this file) avoids two competing logout mechanisms — the previous
// window.location.href reload wiped React state before any "session
// expired" message could ever be shown.
let unauthorizedHandler = null;
export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

// Normalize error messages and delegate 401s to the registered handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    const normalizedError = new Error(message);
    normalizedError.status = status; // lets callers tell "unauthorized" apart from "network/server error"

    if (status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(normalizedError);
  }
);

export default api;