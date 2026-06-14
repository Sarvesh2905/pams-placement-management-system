import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const coordinatorAPI = axios.create({
  baseURL: `${API_URL}/coordinator`,
});

// Add request interceptor to include token
coordinatorAPI.interceptors.request.use(
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

export const coordinatorService = {
  getStudents: (year = 'all') => coordinatorAPI.get(`/students?year=${year}`),
  updateStudentCGPA: (id, cgpa) => coordinatorAPI.put(`/students/${id}/cgpa`, { cgpa }),
  getPlacementAnnouncements: () => coordinatorAPI.get('/placement-announcements'),
  getNotifications: () => coordinatorAPI.get('/notifications'),
  markNotificationAsRead: (id) => coordinatorAPI.put(`/notifications/${id}/read`),
};
