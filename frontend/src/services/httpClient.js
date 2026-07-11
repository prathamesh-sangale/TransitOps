import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

httpClient.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized logic centrally, e.g. emit event or trigger redirect if implemented later.
    // Right now, AuthContext manages its own session expiry on reload, but this prepares it for backend.
    console.warn('Unauthorized access - API responded with 401');
  }
  return Promise.reject(error);
});


export default httpClient;
