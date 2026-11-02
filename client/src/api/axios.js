import axios from 'axios';

let rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = `https://${rawUrl}`;
}
if (rawUrl && !rawUrl.endsWith('/api') && !rawUrl.endsWith('/api/')) {
  rawUrl = rawUrl.replace(/\/+$/, '') + '/api';
}
const API_BASE_URL = rawUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attach token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('glowup_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthenticated on protected routes, clear state
      const hadToken = localStorage.getItem('glowup_token');
      if (hadToken && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('glowup_token');
        localStorage.removeItem('glowup_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
