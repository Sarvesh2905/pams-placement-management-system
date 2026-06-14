import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authAPI = axios.create({
  baseURL: `${API_URL}/auth`,
});

// Add request interceptor to include token
authAPI.interceptors.request.use(
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

export const authService = {
  login: (email, password, role) => authAPI.post('/login', { email, password, role }),
  verifyToken: () => authAPI.get('/verify'),
  createAdmin: () => authAPI.post('/create-admin'),
};
