import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dinenear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dinenear_token');
      localStorage.removeItem('dinenear_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
