const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Protect all student routes
router.use(protect);
router.use(authorize('student'));

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.get('/alumni', studentController.getAlumni);
router.get('/placement-announcements', studentController.getPlacementAnnouncements);
router.get('/notifications', studentController.getNotifications);

module.exports = router;
