import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error structures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, we could clear local token (optional, based on standard flow)
    const errMessage = 
      error.response?.data?.message || 
      error.response?.data?.errors?.[0]?.message || 
      'A network error occurred. Please try again.';
    
    // Attach clean message for direct catch block usage
    error.cleanMessage = errMessage;
    return Promise.reject(error);
  }
);

export default api;
