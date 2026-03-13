const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getEmployees } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/employees', protect, admin, getEmployees);

module.exports = router;
