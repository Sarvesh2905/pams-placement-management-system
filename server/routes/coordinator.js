const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');
const { protect, authorize } = require('../middleware/auth');

// Protect all coordinator routes
router.use(protect);
router.use(authorize('coordinator'));

router.get('/students', coordinatorController.getStudents);
router.put('/students/:id/cgpa', coordinatorController.updateStudentCGPA);
router.get('/placement-announcements', coordinatorController.getPlacementAnnouncements);
router.get('/notifications', coordinatorController.getNotifications);

module.exports = router;
