const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// Student routes
router.post('/students', adminController.addStudent);
router.get('/students', adminController.getStudents);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Company routes
router.post('/companies', adminController.addCompany);
router.get('/companies', adminController.getCompanies);
router.put('/companies/:id', adminController.updateCompany);
router.delete('/companies/:id', adminController.deleteCompany);

// Coordinator routes
router.post('/coordinators', adminController.addCoordinator);
router.get('/coordinators', adminController.getCoordinators);
router.put('/coordinators/:id', adminController.updateCoordinator);
router.delete('/coordinators/:id', adminController.deleteCoordinator);

// Alumni routes
router.post('/alumni', adminController.addAlumni);
router.get('/alumni', adminController.getAlumni);

// Placement announcements
router.post('/placement-announcements', adminController.announcePlacement);
router.get('/placement-announcements', adminController.getPlacementAnnouncements);

// Notifications
router.post('/notifications', adminController.sendNotification);
router.get('/notifications', adminController.getNotifications);

// Dashboard stats
router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;
