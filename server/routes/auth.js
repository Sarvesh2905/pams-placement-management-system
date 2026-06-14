const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/verify', authController.verifyToken);
router.post('/create-admin', authController.createAdmin);

module.exports = router;
