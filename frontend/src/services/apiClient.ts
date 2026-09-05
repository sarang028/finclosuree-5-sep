import axios from 'axios';

/**
 * Returns backend base URL (without trailing /api)
 * In local dev (localhost): defaults to http://localhost:5000
 * In production: reads VITE_API_URL or defaults to '' (same domain)
 */
export const getBackendBaseUrl = (): string => {
  const rawApiUrl = import.meta.env.VITE_API_URL;
  if (rawApiUrl) {
    const cleaned = rawApiUrl.replace(/\/+$/, '');
    return cleaned.endsWith('/api') ? cleaned.slice(0, -4) : cleaned;
  }
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1')
  ) {
    return '';
  }
  return 'http://localhost:5000';
};

/**
 * Returns API base URL (ending with /api)
 * In local dev (localhost): defaults to http://localhost:5000/api
 * In production: reads VITE_API_URL or defaults to /api (same Vercel domain)
 */
export const getApiBaseUrl = (): string => {
  const rawApiUrl = import.meta.env.VITE_API_URL;
  if (rawApiUrl) {
    const cleaned = rawApiUrl.replace(/\/+$/, '');
    return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
  }
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1')
  ) {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem('finclosure_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('finclosure_token');
      localStorage.removeItem('finclosure_user');
    }
    return Promise.reject(error);
  }
);

