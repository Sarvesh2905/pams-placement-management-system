import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const adminAPI = axios.create({
  baseURL: `${API_URL}/admin`,
});

// Add request interceptor to include token
adminAPI.interceptors.request.use(
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

export const adminService = {
  // Student operations
  addStudent: (studentData) => adminAPI.post('/students', studentData),
  getStudents: () => adminAPI.get('/students'),
  updateStudent: (id, studentData) => adminAPI.put(`/students/${id}`, studentData),
  deleteStudent: (id) => adminAPI.delete(`/students/${id}`),

  // Company operations
  addCompany: (companyData) => adminAPI.post('/companies', companyData),
  getCompanies: () => adminAPI.get('/companies'),
  updateCompany: (id, companyData) => adminAPI.put(`/companies/${id}`, companyData),
  deleteCompany: (id) => adminAPI.delete(`/companies/${id}`),

  // Coordinator operations
  addCoordinator: (coordinatorData) => adminAPI.post('/coordinators', coordinatorData),
  getCoordinators: () => adminAPI.get('/coordinators'),
  updateCoordinator: (id, coordinatorData) => adminAPI.put(`/coordinators/${id}`, coordinatorData),
  deleteCoordinator: (id) => adminAPI.delete(`/coordinators/${id}`),

  // Alumni operations
  addAlumni: (alumniData) => adminAPI.post('/alumni', alumniData),
  getAlumni: () => adminAPI.get('/alumni'),

  // Placement announcements
  announcePlacement: (announcementData) => adminAPI.post('/placement-announcements', announcementData),
  getPlacementAnnouncements: () => adminAPI.get('/placement-announcements'),

  // Notifications
  sendNotification: (notificationData) => adminAPI.post('/notifications', notificationData),
  getNotifications: () => adminAPI.get('/notifications'),

  // Dashboard statistics
  getDashboardStats: () => adminAPI.get('/dashboard-stats'),
};
