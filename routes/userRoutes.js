// routes/userRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

// --- PUBLIC ROUTES ---
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// =========================================================================
// --- NEW ROUTE FOR PASSWORD UPDATE ---
// =========================================================================
// This route is protected. The 'protect' middleware will run first to ensure
// the user is logged in before they can access the 'updateMyPassword' function.
router.patch('/updateMyPassword', authController.protect, authController.updateMyPassword);
router.patch(
  '/updateMe',
  authController.protect,       // 1. Check if user is logged in
  userController.uploadUserPhoto, // 2. Upload photo to disk
  userController.updateMe         // 3. Update user data in DB
);

module.exports = router;