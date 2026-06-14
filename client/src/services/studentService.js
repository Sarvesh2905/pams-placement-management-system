import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const studentAPI = axios.create({
  baseURL: `${API_URL}/student`,
});

// Add request interceptor to include token
studentAPI.interceptors.request.use(
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

export const studentService = {
  getProfile: () => studentAPI.get('/profile'),
  updateProfile: (profileData) => studentAPI.put('/profile', profileData),
  getAlumni: () => studentAPI.get('/alumni'),
  getPlacementAnnouncements: () => studentAPI.get('/placement-announcements'),
  getNotifications: () => studentAPI.get('/notifications'),
};
